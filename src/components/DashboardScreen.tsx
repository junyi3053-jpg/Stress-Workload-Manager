import React, { useState } from 'react';
import { Menu, Plus, Clock, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Circle } from 'lucide-react';
import { Task, LifeCategory, CATEGORY_CONFIG } from '../types';
import { RingMeter } from './RingMeter';
import { EnergyEngine } from '../services/EnergyEngine';

interface DashboardScreenProps {
  tasks: Task[];
  onOpenMenu: () => void;
  onOpenNewTask: () => void;
  onSelectTask: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onResetSampleData?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  tasks,
  onOpenMenu,
  onOpenNewTask,
  onSelectTask,
  onToggleSubtask,
  onResetSampleData,
}) => {
  // Today's formatted date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Keep track of which tasks are expanded
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Calculate dynamic load across the 4 categories based on remaining incomplete tasks
  const ringPercentages = EnergyEngine.calculateRingPoints(tasks);

  // Sort tasks by urgency
  const sortedTasks = EnergyEngine.sortTasksByUrgency(tasks);

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#F0F3EF] relative pb-20">
      <div>
        {/* Top Header with Hamburger icon and Student profile badge */}
        <div className="sticky top-0 z-20 bg-[#F0F3EF]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E7E2] flex items-center justify-between">
          <button
            id="hamburger-menu-btn"
            onClick={onOpenMenu}
            className="p-2 -ml-1.5 rounded-xl text-[#1E2A28] hover:bg-white/70 transition-colors"
            aria-label="Open side drawer"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#5C6B67] hidden sm:inline">
              Term 1 · Week 4
            </span>
            <div className="w-8 h-8 rounded-full bg-[#2F6F63]/15 border border-[#2F6F63]/25 text-[#2F6F63] flex items-center justify-center font-newsreader italic text-sm font-semibold">
              A
            </div>
          </div>
        </div>

        {/* Greeting & Date Section */}
        <div className="px-5 pt-4 pb-2">
          <span className="text-xs font-medium text-[#5C6B67] uppercase tracking-wider block mb-0.5">
            {dateStr}
          </span>
          <h1 className="font-newsreader italic text-3xl font-medium text-[#1E2A28] tracking-tight">
            Good afternoon, Alex
          </h1>
          <p className="text-xs text-[#5C6B67] mt-1">
            Energy and stress load across your active commitments:
          </p>
        </div>

        {/* 4 Ring Meters in a Row for Mental / Physical / Social / Errands */}
        <div className="px-4 py-3">
          <div className="bg-white rounded-2xl p-4 border border-[#E2E7E2] shadow-2xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C6B67]">
                Daily Stress Rings
              </span>
              <span className="text-[10px] text-[#93A09B] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F63]" />
                Live capacity
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <RingMeter category="Mental" value={ringPercentages.mental} max={EnergyEngine.CAPACITIES.mental} />
              <RingMeter category="Physical" value={ringPercentages.physical} max={EnergyEngine.CAPACITIES.physical} />
              <RingMeter category="Social" value={ringPercentages.social} max={EnergyEngine.CAPACITIES.social} />
              <RingMeter category="Errands" value={ringPercentages.errands} max={EnergyEngine.CAPACITIES.errands} />
            </div>
          </div>
        </div>

        {/* Tasks Section Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1E2A28]">
              Active Tasks
            </h2>
            <span className="px-1.5 py-0.2 rounded-full bg-[#E2E7E2] text-[#5C6B67] text-[11px] font-medium">
              {tasks.length}
            </span>
          </div>
          <span className="text-[11px] text-[#93A09B]">Sorted by urgency</span>
        </div>

        {/* Task List or Empty State */}
        <div className="px-4 space-y-2.5">
          {sortedTasks.length === 0 ? (
            /* Empty State */
            <div
              id="empty-state-card"
              className="my-8 py-16 px-6 rounded-2xl bg-white border border-[#E2E7E2] text-center shadow-2xs flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#F0F3EF] flex items-center justify-center text-[#93A09B] mb-3">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-medium text-[#5C6B67] max-w-xs">
                Nothing on your plate. Add a task to see it here.
              </p>
              {onResetSampleData && (
                <button
                  onClick={onResetSampleData}
                  className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#2F6F63] bg-[#2F6F63]/10 hover:bg-[#2F6F63]/15 border border-[#2F6F63]/20 transition-colors"
                >
                  Load sample student tasks
                </button>
              )}
            </div>
          ) : (
            /* Task Rows */
            sortedTasks.map((task) => {
              const dominantCfg = CATEGORY_CONFIG[task.dominantCategory];
              const urgency = EnergyEngine.evaluateUrgency(task.dueDate);
              const completedSteps = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  id={`task-card-${task.id}`}
                  onClick={() => onSelectTask(task)}
                  className="relative group bg-white rounded-xl border border-[#E2E7E2] p-3.5 pl-4 cursor-pointer transition-all hover:border-[#2F6F63]/40 shadow-2xs hover:shadow-xs overflow-hidden"
                >
                  {/* Colored left accent bar matching dominant category */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                    style={{ backgroundColor: dominantCfg.color }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Task Name */}
                      <h3 className="text-sm font-medium text-[#1E2A28] leading-tight group-hover:text-[#2F6F63] transition-colors truncate">
                        {task.name}
                      </h3>

                      {/* Step count + total minutes */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[#5C6B67]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#93A09B]" />
                          <span>
                            {task.subtasks.length} steps · {task.totalMinutes} mins
                          </span>
                        </span>
                        {completedSteps > 0 && (
                          <span className="text-[11px] text-[#2F6F63] font-medium">
                            ({completedSteps}/{task.subtasks.length} done)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse and Due-date label */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md inline-block ${
                          urgency.isUrgent
                            ? 'bg-[#C1483B]/10 text-[#C1483B] font-semibold'
                            : 'text-[#5C6B67] bg-[#F0F3EF]'
                        }`}
                      >
                        {urgency.label}
                      </span>
                      {task.subtasks.length > 0 && (
                        <button
                          onClick={(e) => toggleExpand(task.id, e)}
                          className="p-1 rounded-md hover:bg-[#F0F3EF] text-[#5C6B67] transition-colors"
                        >
                          {expandedTasks[task.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Action Steps Details */}
                  {expandedTasks[task.id] && (
                    <div className="mt-4 pt-3 border-t border-[#E2E7E2] flex flex-col gap-3">
                      {task.subtasks.map((step) => {
                        return (
                          <div
                            key={step.id}
                            className="flex flex-col bg-[#F0F3EF]/50 rounded-lg p-2.5 gap-2"
                            onClick={(e) => e.stopPropagation()} // prevent opening task details
                          >
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => onToggleSubtask(task.id, step.id)}
                                className="mt-0.5 shrink-0 transition-colors"
                              >
                                {step.completed ? (
                                  <CheckCircle2 size={16} className="text-[#2F6F63]" />
                                ) : (
                                  <Circle size={16} className="text-[#93A09B]" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium leading-snug truncate ${step.completed ? 'line-through text-[#93A09B]' : 'text-[#1E2A28]'}`}>
                                  {step.title}
                                </p>
                                <span className="text-[10px] text-[#5C6B67] flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> {step.estimatedMinutes} mins
                                </span>
                              </div>
                            </div>

                            {/* Slide bars / Segmented Bar for Energy Impact */}
                            <div className="pl-6 text-[10px] space-y-1.5 mt-1">
                              {(['Mental', 'Physical', 'Social', 'Errands'] as LifeCategory[]).map(cat => {
                                const val = step.category === cat ? step.cortisolDelta : 0;
                                const catCfg = CATEGORY_CONFIG[cat];
                                const maxVal = 20; // assumed max delta for visual scaling
                                const activeSegments = Math.min(10, Math.ceil((val / maxVal) * 10));
                                
                                return (
                                  <div key={cat} className="flex items-center gap-2">
                                    <span className="w-[45px] text-[#5C6B67] font-medium text-[9px] uppercase tracking-wider">[{cat}]</span>
                                    <span className="w-5 font-semibold text-[#1E2A28] text-right text-[10px]">+{val}</span>
                                    <div className="flex gap-[3px] ml-1">
                                      {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-2.5 h-3 rounded-[2px] ${i < activeSegments ? 'opacity-100' : 'opacity-20'}`}
                                          style={{ backgroundColor: i < activeSegments ? catCfg.color : '#93A09B' }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating "+" Button bottom right inside mobile phone frame */}
      <div className="absolute bottom-6 right-5 z-30">
        <button
          id="floating-add-task-btn"
          onClick={onOpenNewTask}
          className="w-14 h-14 rounded-full bg-[#2F6F63] hover:bg-[#275d53] active:bg-[#1E4b43] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#2F6F63]/30"
          aria-label="Add new task"
          title="Add task"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
