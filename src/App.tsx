/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mobile App Root Container
 * 
 * ARCHITECTURAL GUIDELINES (Mobile & Cross-Platform Conversion):
 * - Strict Mobile Dimensions: Designed directly for standard phone dimensions (390px × 844px).
 * - Framework Agnostic Business Logic: Delegates persistence to TaskRepository and math to EnergyEngine.
 * - Conversion Map:
 *     - Flutter: MaterialApp -> Scaffold (body: IndexedStack or Navigator)
 *     - SwiftUI: WindowGroup -> NavigationStack
 *     - Jetpack Compose: setContent { NavHost(navController) }
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, Task, SubTask, LifeCategory } from './types';
import { TaskRepository } from './services/TaskRepository';
import { DashboardScreen } from './components/DashboardScreen';
import { NewTaskScreen } from './components/NewTaskScreen';
import { BreakdownConfirmScreen } from './components/BreakdownConfirmScreen';
import { TaskDetailScreen } from './components/TaskDetailScreen';
import { PlaceholderScreen } from './components/PlaceholderScreen';
import { SideDrawer } from './components/SideDrawer';
import { Wifi, Battery } from 'lucide-react';

export default function App() {
  // Mobile Navigation Stack State
  const [screen, setScreen] = useState<ScreenType>('dashboard');
  const [history, setHistory] = useState<ScreenType[]>(['dashboard']);

  // Drawer menu visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Task state synchronized via TaskRepository
  const [tasks, setTasks] = useState<Task[]>(() => TaskRepository.loadTasks());

  useEffect(() => {
    TaskRepository.saveTasks(tasks);
  }, [tasks]);

  // Selected task for task detail screen
  const [selectedTask, setSelectedTask] = useState<Task | null>(() => tasks[0] || null);

  // Draft task data for breakdown confirmation screen
  const [breakdownDraft, setBreakdownDraft] = useState<{
    name: string;
    description: string;
    importance: number;
    dueDate: string;
    impact: { mental: number; physical: number; social: number; errands: number };
    aiNote: string;
    generatedSteps: SubTask[];
    dominantCategory: LifeCategory;
  } | null>(null);

  // Real-time mobile clock
  const [currentTime, setCurrentTime] = useState('9:41');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handlers
  const navigateTo = (nextScreen: ScreenType) => {
    setHistory((prev) => [...prev, nextScreen]);
    setScreen(nextScreen);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const updated = [...history];
      updated.pop();
      const previous = updated[updated.length - 1];
      setHistory(updated);
      setScreen(previous);
    } else {
      setScreen('dashboard');
      setHistory(['dashboard']);
    }
  };

  // Task Domain Actions (Mapped to Repository)
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    navigateTo('task_detail');
  };

  const handleProceedToBreakdown = (draft: {
    name: string;
    description: string;
    importance: number;
    dueDate: string;
    impact: { mental: number; physical: number; social: number; errands: number };
    aiNote: string;
    generatedSteps: SubTask[];
    dominantCategory: LifeCategory;
  }) => {
    setBreakdownDraft(draft);
    navigateTo('breakdown_confirm');
  };

  const handleConfirmTask = (newTask: Task) => {
    const updated = TaskRepository.addTask(tasks, newTask);
    setTasks(updated);
    setSelectedTask(newTask);
    setScreen('dashboard');
    setHistory(['dashboard']);
  };

  const handleRemoveTask = (taskId: string) => {
    const updated = TaskRepository.deleteTask(tasks, taskId);
    setTasks(updated);
    handleBack();
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = TaskRepository.toggleSubtask(tasks, taskId, subtaskId);
    setTasks(updated);

    setSelectedTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ),
      };
    });
  };

  const handleResetSampleData = () => {
    const sample = TaskRepository.getSampleTasks();
    setTasks(sample);
    setSelectedTask(sample[0]);
  };

  return (
    <div className="min-h-screen bg-[#E5EAE3] text-[#1E2A28] flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-[#2F6F63]/20">
      {/* Mobile Device Frame Container (Phone dimension: 412px × 863px -> equivalent to 163.4 x 78 mm) */}
      <div className="w-full h-[100dvh] sm:h-[863px] sm:max-w-[412px] sm:rounded-[44px] sm:border-[9px] sm:border-[#1C2522] sm:shadow-2xl bg-[#F0F3EF] flex flex-col relative overflow-hidden transition-all">
        
        {/* Mobile Status Bar */}
        <div className="h-11 pt-2.5 px-6 shrink-0 flex items-center justify-between text-[13px] font-semibold text-[#1E2A28] z-30 select-none bg-[#F0F3EF]">
          <span className="w-12 tracking-tight">{currentTime}</span>

          {/* Dynamic Island / Camera Notch */}
          <div className="w-[106px] h-5 bg-[#1C2522] rounded-full mx-auto shadow-inner flex items-center justify-end pr-2.5">
            <span className="w-2 h-2 rounded-full bg-[#27322F]/80 ring-1 ring-[#394642]/50" />
          </div>

          <div className="w-12 flex items-center justify-end gap-1.5 text-[#1E2A28]">
            <span className="text-[10px] font-bold">5G</span>
            <Wifi size={13} strokeWidth={2.4} />
            <Battery size={15} strokeWidth={2.2} />
          </div>
        </div>

        {/* Side Drawer Component (Contained within mobile phone canvas) */}
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentScreen={screen}
          onNavigate={(targetScreen) => {
            navigateTo(targetScreen);
          }}
        />

        {/* Mobile Viewport Screen Area */}
        <main className="flex-1 overflow-y-auto relative w-full flex flex-col">
          {screen === 'dashboard' && (
            <DashboardScreen
              tasks={tasks}
              onOpenMenu={() => setIsDrawerOpen(true)}
              onOpenNewTask={() => navigateTo('new_task')}
              onSelectTask={handleSelectTask}
              onToggleSubtask={handleToggleSubtask}
              onResetSampleData={handleResetSampleData}
            />
          )}

          {screen === 'new_task' && (
            <NewTaskScreen
              onBack={handleBack}
              onProceedToBreakdown={handleProceedToBreakdown}
            />
          )}

          {screen === 'breakdown_confirm' && breakdownDraft && (
            <BreakdownConfirmScreen
              draft={breakdownDraft}
              onBack={handleBack}
              onConfirm={handleConfirmTask}
            />
          )}

          {screen === 'task_detail' && selectedTask && (
            <TaskDetailScreen
              task={selectedTask}
              onBack={handleBack}
              onToggleSubtask={handleToggleSubtask}
              onRemoveTask={handleRemoveTask}
            />
          )}

          {screen === 'health_stress' && (
            <PlaceholderScreen
              type="health_stress"
              onBack={handleBack}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          )}

          {screen === 'guidance_alerts' && (
            <PlaceholderScreen
              type="guidance_alerts"
              onBack={handleBack}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          )}
        </main>

        {/* Mobile Home Indicator (iOS Bottom Bar) */}
        <div className="shrink-0 h-6 flex items-center justify-center bg-[#F0F3EF] z-30 select-none">
          <div className="w-32 h-1 bg-[#1E2A28]/35 rounded-full" />
        </div>
      </div>
    </div>
  );
}
