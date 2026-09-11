import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, Check, Sparkles } from 'lucide-react';
import { SubTask, LifeCategory, CATEGORY_CONFIG, Task } from '../types';
import { EnergyEngine } from '../services/EnergyEngine';

interface BreakdownConfirmScreenProps {
  draft: {
    name: string;
    description: string;
    importance: number;
    dueDate: string;
    impact: { mental: number; physical: number; social: number; errands: number };
    aiNote: string;
    generatedSteps: SubTask[];
    dominantCategory: LifeCategory;
  };
  onBack: () => void;
  onConfirm: (task: Task) => void;
}

export const BreakdownConfirmScreen: React.FC<BreakdownConfirmScreenProps> = ({
  draft,
  onBack,
  onConfirm,
}) => {
  const [steps, setSteps] = useState<SubTask[]>(draft.generatedSteps);
  const urgency = EnergyEngine.evaluateUrgency(draft.dueDate);

  // Recalculate total impact dynamically from steps if edited
  const calculatedImpact = EnergyEngine.aggregateSubtaskImpact(steps);

  const totalMinutes = steps.reduce((sum, s) => sum + (Number(s.estimatedMinutes) || 0), 0);

  const handleUpdateStepTitle = (id: string, newTitle: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleUpdateCategory = (id: string, newCat: LifeCategory) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, category: newCat } : s))
    );
  };

  const handleUpdateMinutes = (id: string, mins: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estimatedMinutes: Math.max(5, mins) } : s))
    );
  };

  const handleUpdateDelta = (id: string, delta: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, cortisolDelta: Math.max(1, delta) } : s))
    );
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) return; // Keep at least one step
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddStep = () => {
    const newStep: SubTask = {
      id: `step-custom-${Date.now()}`,
      title: 'New action item',
      category: 'Mental',
      estimatedMinutes: 20,
      cortisolDelta: 10,
      completed: false,
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const handleSaveAndAdd = () => {
    const dominantCategory = EnergyEngine.getDominantCategory(calculatedImpact);

    const finalizedTask: Task = {
      id: `task-${Date.now()}`,
      name: draft.name,
      description: draft.description,
      importance: draft.importance,
      dueDate: draft.dueDate,
      dominantCategory,
      totalMinutes,
      subtasks: steps,
      impact: calculatedImpact,
      aiNote: draft.aiNote,
      createdAt: new Date().toISOString(),
    };

    onConfirm(finalizedTask);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#F0F3EF]">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#F0F3EF]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E7E2] flex items-center justify-between">
          <button
            id="breakdown-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#5C6B67] hover:text-[#1E2A28] p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Edit details</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#93A09B]">
            Step Breakdown
          </span>
          <div className="w-12" />
        </div>

        {/* Task Title & Due Date Card at top */}
        <div className="p-4">
          <div className="p-4 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h1 className="font-newsreader text-xl font-semibold text-[#1E2A28] leading-tight">
                {draft.name}
              </h1>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${
                  urgency.isUrgent
                    ? 'bg-[#C1483B]/10 text-[#C1483B] font-semibold'
                    : 'bg-[#F0F3EF] text-[#5C6B67]'
                }`}
              >
                {urgency.label}
              </span>
            </div>

            {draft.description && (
              <p className="text-xs text-[#5C6B67] mb-3 leading-relaxed">
                {draft.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-[#5C6B67] pt-2 border-t border-[#E2E7E2]/70">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#93A09B]" />
                <span>{totalMinutes} mins total</span>
              </span>
              <span>·</span>
              <span>{steps.length} atomic steps</span>
            </div>
          </div>
        </div>

        {/* Summary Row Showing Total Predicted Impact per Category */}
        <div className="px-4 mb-4">
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C6B67]">
                Total Predicted Load Impact
              </span>
              <span className="text-[10px] text-[#93A09B]">Live recalculated</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['Mental', 'Physical', 'Social', 'Errands'] as LifeCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const key = cat.toLowerCase() as keyof typeof calculatedImpact;
                const val = calculatedImpact[key];
                return (
                  <div
                    key={cat}
                    className="py-1.5 px-2 rounded-lg border text-center"
                    style={{
                      backgroundColor: cfg.bgFaint,
                      borderColor: cfg.borderFaint,
                    }}
                  >
                    <span className="block text-[10px] font-medium text-[#5C6B67]">
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
          </div>
        </div>

        {/* Editable list of AI-generated subtasks */}
        <div className="px-4 space-y-2.5 mb-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5C6B67]">
              Generated Action Steps
            </h2>
            <span className="text-[11px] text-[#93A09B]">Editable below</span>
          </div>

          {steps.map((step, index) => {
            const config = CATEGORY_CONFIG[step.category];
            return (
              <div
                key={step.id}
                className="p-3 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs space-y-2.5 transition-all hover:border-[#2F6F63]/30"
              >
                {/* Top row: Title input & Delete */}
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F0F3EF] text-[#5C6B67] text-[11px] font-medium flex items-center justify-center shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStepTitle(step.id, e.target.value)}
                    className="flex-1 text-sm text-[#1E2A28] font-medium focus:outline-hidden focus:ring-1 focus:ring-[#2F6F63] rounded px-1.5 py-0.5 border border-transparent hover:border-[#E2E7E2]"
                  />
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    disabled={steps.length <= 1}
                    className="p-1.5 text-[#93A09B] hover:text-[#C1483B] hover:bg-[#C1483B]/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#93A09B]"
                    title="Delete step"
                    aria-label="Delete step"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Bottom row: Category dropdown, Minutes, Colored Category Pill + Cortisol Delta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F0F3EF]">
                  {/* Category dropdown */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={step.category}
                      onChange={(e) =>
                        handleUpdateCategory(step.id, e.target.value as LifeCategory)
                      }
                      className="text-xs font-medium px-2 py-1 rounded-lg border border-[#E2E7E2] bg-[#F0F3EF] text-[#1E2A28] focus:outline-hidden focus:ring-1 focus:ring-[#2F6F63]"
                    >
                      <option value="Mental">Mental</option>
                      <option value="Physical">Physical</option>
                      <option value="Social">Social</option>
                      <option value="Errands">Errands</option>
                    </select>

                    {/* Minutes input */}
                    <div className="flex items-center gap-1 text-xs text-[#5C6B67] bg-[#F0F3EF] px-2 py-1 rounded-lg border border-[#E2E7E2]">
                      <Clock size={12} className="text-[#93A09B]" />
                      <input
                        type="number"
                        min={5}
                        max={240}
                        step={5}
                        value={step.estimatedMinutes}
                        onChange={(e) =>
                          handleUpdateMinutes(step.id, parseInt(e.target.value) || 5)
                        }
                        className="w-8 text-center bg-transparent text-[#1E2A28] font-medium focus:outline-hidden"
                      />
                      <span>m</span>
                    </div>
                  </div>

                  {/* Colored Category Pill + Cortisol Delta number */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: config.bgFaint,
                      color: config.color,
                      border: `1px solid ${config.borderFaint}`,
                    }}
                  >
                    <span>{step.category}</span>
                    <span>·</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={step.cortisolDelta}
                      onChange={(e) =>
                        handleUpdateDelta(step.id, parseInt(e.target.value) || 1)
                      }
                      className="w-7 text-center bg-transparent font-bold focus:outline-hidden"
                    />
                    <span>pts</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* "+ Add step" dashed button */}
          <button
            id="add-step-btn"
            onClick={handleAddStep}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#2F6F63]/40 bg-white/50 hover:bg-white text-xs font-semibold text-[#2F6F63] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Plus size={15} />
            <span>Add step</span>
          </button>
        </div>
      </div>

      {/* Primary Action Button at bottom */}
      <div className="p-4 bg-white border-t border-[#E2E7E2] sticky bottom-0 z-20">
        <button
          id="confirm-add-task-btn"
          onClick={handleSaveAndAdd}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#2F6F63] hover:bg-[#275d53] text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
        >
          <Check size={16} />
          <span>Confirm and add to dashboard</span>
        </button>
      </div>
    </div>
  );
};
