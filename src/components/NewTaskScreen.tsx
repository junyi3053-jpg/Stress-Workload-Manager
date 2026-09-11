import React, { useState, useEffect, useId } from 'react';
import { ArrowLeft, Loader2, Sparkles, Calendar as CalendarIcon, Info } from 'lucide-react';
import { CATEGORY_CONFIG, LifeCategory, SubTask } from '../types';
import { predictTaskImpact, generateBreakdownSteps } from '../utils/aiBreakdown';

interface NewTaskScreenProps {
  onBack: () => void;
  onProceedToBreakdown: (draft: {
    name: string;
    description: string;
    importance: number;
    dueDate: string;
    impact: { mental: number; physical: number; social: number; errands: number };
    aiNote: string;
    generatedSteps: SubTask[];
    dominantCategory: LifeCategory;
  }) => void;
}

export const NewTaskScreen: React.FC<NewTaskScreenProps> = ({
  onBack,
  onProceedToBreakdown,
}) => {
  const taskNameId = useId();
  const descriptionId = useId();
  const dueDateId = useId();
  const [activeTab, setActiveTab] = useState<'manual' | 'todo' | 'calendar'>('manual');
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState<number>(3);
  const [isRepeated, setIsRepeated] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>(() => {
    // Default tomorrow or today
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });

  // AI states
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isBreakingDown, setIsBreakingDown] = useState<boolean>(false);
  const [predictedImpact, setPredictedImpact] = useState({
    mental: 18,
    physical: 4,
    social: 0,
    errands: 6,
  });
  const [aiNote, setAiNote] = useState('Predicting balanced baseline energy distribution.');

  // Debounced impact calculation when user types or changes importance
  useEffect(() => {
    if (!name.trim()) {
      setPredictedImpact({ mental: 10, physical: 0, social: 0, errands: 5 });
      setAiNote('Add a task name to calculate bio-cognitive impact across categories.');
      return;
    }

    setIsThinking(true);
    const timer = setTimeout(() => {
      const res = predictTaskImpact(name, description, importance);
      setPredictedImpact(res.impact);
      setAiNote(res.note);
      setIsThinking(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [name, description, importance]);

  const handleBreakThisDown = () => {
    if (!name.trim()) return;

    setIsBreakingDown(true);
    setTimeout(() => {
      const { steps, dominantCategory } = generateBreakdownSteps(name, description, importance);
      setIsBreakingDown(false);
      onProceedToBreakdown({
        name: name.trim(),
        description: description.trim(),
        importance,
        dueDate,
        impact: predictedImpact,
        aiNote,
        generatedSteps: steps,
        dominantCategory,
        isRepeated,
      });
    }, 850);
  };

  const quickDates = [
    { label: 'Today', value: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'In 3 days', value: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] },
    { label: 'Next week', value: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] },
  ];

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#F0F3EF]">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#F0F3EF]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E7E2] flex items-center justify-between">
          <button
            id="new-task-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#5C6B67] hover:text-[#1E2A28] p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Cancel</span>
          </button>
          <h2 className="font-newsreader text-xl font-medium text-[#1E2A28]">
            New task
          </h2>
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>

        {/* 3 Tabs at Top (Manual active, To-do list & Calendar disabled) */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-3 p-1 bg-[#E2E7E2]/70 rounded-xl">
            <button
              id="tab-manual"
              onClick={() => setActiveTab('manual')}
              className={`py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-[#1E2A28] shadow-xs'
                  : 'text-[#5C6B67] hover:text-[#1E2A28]'
              }`}
            >
              Manual
            </button>
            <button
              id="tab-todo"
              disabled
              title="Importing from to-do lists coming in future update"
              className="py-2 text-xs font-medium rounded-lg text-[#93A09B] opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
            >
              <span>To-do list</span>
            </button>
            <button
              id="tab-calendar"
              disabled
              title="Calendar integration coming in future update"
              className="py-2 text-xs font-medium rounded-lg text-[#93A09B] opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
            >
              <span>Calendar</span>
            </button>
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="px-4 py-2 space-y-4">
          {/* Task Name */}
          <div>
            <label
              htmlFor={taskNameId}
              className="block text-xs font-medium text-[#5C6B67] uppercase tracking-wider mb-1.5"
            >
              Task Name
            </label>
            <input
              id={taskNameId}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Organic Chemistry Midterm Review"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E7E2] text-sm text-[#1E2A28] placeholder-[#93A09B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6F63]/30 focus:border-[#2F6F63] transition-all shadow-2xs"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor={descriptionId}
              className="block text-xs font-medium text-[#5C6B67] uppercase tracking-wider mb-1.5"
            >
              Description &amp; Context
            </label>
            <textarea
              id={descriptionId}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverables, location, or study materials involved..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E7E2] text-sm text-[#1E2A28] placeholder-[#93A09B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6F63]/30 focus:border-[#2F6F63] transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Importance Slider (1-5) */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="importance-slider"
                className="text-xs font-medium text-[#5C6B67] uppercase tracking-wider"
              >
                Importance &amp; Urgency
              </label>
              <span className="font-newsreader text-sm font-semibold text-[#2F6F63]">
                Level {importance} of 5
              </span>
            </div>
            <input
              id="importance-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={importance}
              onChange={(e) => setImportance(parseInt(e.target.value))}
              className="w-full accent-[#2F6F63] cursor-pointer h-2 bg-[#E2E7E2] rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-[#93A09B] mt-1.5 font-medium">
              <span>Low (Flexible)</span>
              <span>Moderate</span>
              <span>Critical Exam/Deadline</span>
            </div>
          </div>

          {/* Repeated Task Toggle & Due Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-xl border border-[#E2E7E2] shadow-2xs">
              <div>
                <label className="text-sm font-medium text-[#1E2A28]">Repeated Task</label>
                <p className="text-[11px] text-[#5C6B67]">Disable strict due dates for routine tasks</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRepeated(!isRepeated)}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${isRepeated ? 'bg-[#2F6F63]' : 'bg-[#E2E7E2]'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isRepeated ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            <div className={`transition-opacity ${isRepeated ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={dueDateId}
                  className="text-xs font-medium text-[#5C6B67] uppercase tracking-wider"
                >
                  Due Date
                </label>
                <div className="flex items-center gap-1 text-xs text-[#5C6B67]">
                  <CalendarIcon size={13} className="text-[#2F6F63]" />
                  <span>Selected: {dueDate}</span>
                </div>
              </div>

              {/* Quick chips */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {quickDates.map((d) => {
                  const isSelected = dueDate === d.value;
                  return (
                    <button
                      key={d.label}
                      type="button"
                      disabled={isRepeated}
                      onClick={() => setDueDate(d.value)}
                      className={`py-1.5 text-xs rounded-lg border transition-all text-center ${
                        isSelected
                          ? 'bg-[#2F6F63] text-white border-[#2F6F63]'
                          : 'bg-white text-[#5C6B67] border-[#E2E7E2] hover:bg-[#F0F3EF]'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <input
                id={dueDateId}
                type="date"
                disabled={isRepeated}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E7E2] text-sm text-[#1E2A28] focus:outline-hidden focus:ring-2 focus:ring-[#2F6F63]/30 focus:border-[#2F6F63] shadow-2xs disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* AI Predicted Impact Card */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2A28]">
                <Sparkles size={14} className="text-[#7B6CC4]" />
                <span>AI Predicted Impact</span>
              </div>
              {isThinking && (
                <div className="flex items-center gap-1 text-[11px] text-[#7B6CC4] animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Calculating...</span>
                </div>
              )}
            </div>

            {isThinking ? (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Loader2 size={24} className="animate-spin text-[#7B6CC4] mb-2" />
                <p className="text-xs text-[#5C6B67] font-medium">
                  Thinking about this task...
                </p>
              </div>
            ) : (
              <div>
                {/* 4 small numbers (+N) for Mental / Physical / Social / Errands */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {(['Mental', 'Physical', 'Social', 'Errands'] as LifeCategory[]).map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const key = cat.toLowerCase() as keyof typeof predictedImpact;
                    const val = predictedImpact[key];
                    return (
                      <div
                        key={cat}
                        className="p-2 rounded-lg border text-center"
                        style={{
                          backgroundColor: cfg.bgFaint,
                          borderColor: cfg.borderFaint,
                        }}
                      >
                        <span className="block text-[10px] font-medium text-[#5C6B67] truncate">
                          {cat}
                        </span>
                        <span
                          className="font-newsreader text-base font-bold"
                          style={{ color: cfg.color }}
                        >
                          +{val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* One-line note */}
                <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-[#F0F3EF] text-xs text-[#5C6B67] leading-tight">
                  <Info size={14} className="text-[#5C6B67] shrink-0 mt-0.5" />
                  <p>{aiNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button at Bottom */}
      <div className="p-4 bg-white border-t border-[#E2E7E2] sticky bottom-0 z-20">
        <button
          id="break-down-task-btn"
          disabled={!name.trim() || isBreakingDown}
          onClick={handleBreakThisDown}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
            !name.trim() || isBreakingDown
              ? 'bg-[#E2E7E2] text-[#93A09B] cursor-not-allowed'
              : 'bg-[#2F6F63] hover:bg-[#275d53] text-white active:scale-[0.99]'
          }`}
        >
          {isBreakingDown ? (
            <>
              <Loader2 size={16} className="animate-spin text-white" />
              <span>Breaking task down...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Break this down</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
