import React, { useState } from 'react';
import { ArrowLeft, Clock, Trash2, CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';
import { Task, LifeCategory, CATEGORY_CONFIG } from '../types';
import { EnergyEngine } from '../services/EnergyEngine';

interface TaskDetailScreenProps {
  task: Task;
  onBack: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task,
  onBack,
  onToggleSubtask,
  onRemoveTask,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const urgency = EnergyEngine.evaluateUrgency(task.dueDate);
  const dominantConfig = CATEGORY_CONFIG[task.dominantCategory];
  const completedCount = task.subtasks.filter((s) => s.completed).length;

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#F0F3EF]">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#F0F3EF]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2E7E2] flex items-center justify-between">
          <button
            id="detail-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#5C6B67] hover:text-[#1E2A28] p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Tasks</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#93A09B]">
            Task Details
          </span>
          <div className="w-12" />
        </div>

        <div className="p-4 space-y-4">
          {/* Main Info Card */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs">
            {/* Dominant category tag + Due date badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: dominantConfig.bgFaint,
                  color: dominantConfig.color,
                  border: `1px solid ${dominantConfig.borderFaint}`,
                }}
              >
                {task.dominantCategory} Dominant
              </span>

              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  urgency.isUrgent
                    ? 'bg-[#C1483B]/10 text-[#C1483B] font-semibold'
                    : 'bg-[#F0F3EF] text-[#5C6B67]'
                }`}
              >
                {urgency.label}
              </span>
            </div>

            {/* Task Name in Newsreader serif */}
            <h1 className="font-newsreader text-2xl font-medium text-[#1E2A28] leading-tight mb-2">
              {task.name}
            </h1>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-[#5C6B67] leading-relaxed mb-4">
                {task.description}
              </p>
            )}

            {/* Metadata metrics */}
            <div className="flex items-center gap-4 text-xs text-[#5C6B67] pt-3 border-t border-[#E2E7E2]/70">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#93A09B]" />
                <span>{task.totalMinutes} mins total</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#93A09B]" />
                <span>Target: {task.dueDate}</span>
              </span>
              <span>·</span>
              <span>
                {completedCount} of {task.subtasks.length} done
              </span>
            </div>
          </div>

          {/* Category Impact Summary Card */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E7E2] shadow-2xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6B67] block mb-2.5">
              Category Energy Load
            </span>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {(['Mental', 'Physical', 'Social', 'Errands'] as LifeCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const key = cat.toLowerCase() as keyof typeof task.impact;
                const val = task.impact[key] || 0;
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

            {task.aiNote && (
              <p className="text-xs text-[#5C6B67] italic bg-[#F0F3EF] p-2.5 rounded-lg border border-[#E2E7E2]/70 leading-relaxed">
                "{task.aiNote}"
              </p>
            )}
          </div>

          {/* List of Confirmed Subtasks (Read-only list with completion toggle) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5C6B67]">
                Action Steps ({task.subtasks.length})
              </h2>
              <span className="text-[11px] text-[#93A09B]">Tap to check off</span>
            </div>

            <div className="space-y-2">
              {task.subtasks.map((step) => {
                const cfg = CATEGORY_CONFIG[step.category];
                return (
                  <div
                    key={step.id}
                    onClick={() => onToggleSubtask(task.id, step.id)}
                    className={`p-3 rounded-xl bg-white border border-[#E2E7E2] flex items-start justify-between gap-3 cursor-pointer transition-all hover:border-[#2F6F63]/40 ${
                      step.completed ? 'opacity-60 bg-[#F0F3EF]/60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        className="mt-0.5 text-[#2F6F63] shrink-0"
                        aria-label={step.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {step.completed ? (
                          <CheckCircle2 size={18} className="fill-[#2F6F63] text-white" />
                        ) : (
                          <Circle size={18} className="text-[#93A09B]" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-medium leading-snug ${
                            step.completed
                              ? 'line-through text-[#93A09B]'
                              : 'text-[#1E2A28]'
                          }`}
                        >
                          {step.title}
                        </p>
                        <span className="text-[11px] text-[#93A09B] mt-0.5 block">
                          {step.estimatedMinutes} mins
                        </span>
                      </div>
                    </div>

                    <div
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                      style={{
                        backgroundColor: cfg.bgFaint,
                        color: cfg.color,
                        border: `1px solid ${cfg.borderFaint}`,
                      }}
                    >
                      +{step.cortisolDelta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* "Remove task" button at bottom in red/alert color */}
      <div className="p-4 bg-white border-t border-[#E2E7E2] sticky bottom-0 z-20">
        {showConfirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              id="cancel-delete-task-btn"
              onClick={() => setShowConfirmDelete(false)}
              className="flex-1 py-3 px-3 rounded-xl text-xs font-semibold bg-[#F0F3EF] hover:bg-[#E2E7E2] text-[#5C6B67] transition-all active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-task-btn"
              onClick={() => onRemoveTask(task.id)}
              className="flex-1 py-3 px-3 rounded-xl text-xs font-semibold bg-[#C1483B] hover:bg-[#a83c31] text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] shadow-2xs"
            >
              <Trash2 size={14} />
              <span>Confirm Delete</span>
            </button>
          </div>
        ) : (
          <button
            id="remove-task-btn"
            onClick={() => setShowConfirmDelete(true)}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold bg-[#C1483B]/10 hover:bg-[#C1483B]/15 text-[#C1483B] border border-[#C1483B]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Trash2 size={15} />
            <span>Remove task</span>
          </button>
        )}
      </div>
    </div>
  );
};
