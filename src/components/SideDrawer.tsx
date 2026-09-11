import React from 'react';
import { ScreenType } from '../types';
import { LayoutDashboard, HeartPulse, BellRing, X, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Daily energy rings & urgent tasks',
    },
    {
      id: 'health_stress' as ScreenType,
      label: 'Health and stress',
      icon: HeartPulse,
      description: 'Smartwatch cortisol & recovery feed',
      badge: 'Beta',
    },
    {
      id: 'guidance_alerts' as ScreenType,
      label: 'Guidance and alerts',
      icon: BellRing,
      description: 'Cognitive load & task swaps',
      badge: 'AI',
    },
  ];

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        id="side-drawer-overlay"
        onClick={onClose}
        className="absolute inset-0 bg-[#1E2A28]/45 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer content panel (strictly dimensioned for mobile 390px viewport) */}
      <div
        id="side-drawer-panel"
        className="relative w-[280px] max-w-[80%] h-full bg-[#FFFFFF] border-r border-[#E2E7E2] shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-out"
      >
        <div>
          {/* Header with user info */}
          <div className="p-5 border-b border-[#E2E7E2] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#2F6F63]/10 text-[#2F6F63] flex items-center justify-center font-newsreader italic text-lg font-semibold border border-[#2F6F63]/20">
                A
              </div>
              <div>
                <h3 className="font-newsreader italic text-lg text-[#1E2A28] leading-tight font-medium">
                  Alex Chen
                </h3>
                <p className="text-xs text-[#5C6B67] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F63] inline-block" />
                  Cognitive Science, Yr 3
                </p>
              </div>
            </div>
            <button
              id="close-drawer-button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5C6B67] hover:bg-[#F0F3EF] transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation links */}
          <div className="py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold text-[#93A09B] uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#2F6F63]/10 text-[#2F6F63] font-medium'
                      : 'text-[#1E2A28] hover:bg-[#F0F3EF]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? 'bg-[#2F6F63] text-white' : 'bg-[#F0F3EF] text-[#5C6B67]'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium leading-tight truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-[#2F6F63]/15 text-[#2F6F63]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5C6B67] truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={isActive ? 'text-[#2F6F63]' : 'text-[#93A09B]'} />
                </button>
              );
            })}
          </div>

          {/* Student Workload Context Card */}
          <div className="mx-4 my-2 p-3.5 rounded-xl bg-[#F0F3EF] border border-[#E2E7E2]">
            <div className="flex items-center gap-2 text-[#2F6F63] font-medium text-xs mb-1">
              <Sparkles size={14} />
              <span>Bio-Cognitive Balance</span>
            </div>
            <p className="text-[11px] text-[#5C6B67] leading-relaxed">
              Energy is tracked across 4 life areas. Keep your Mental &amp; Errands load balanced with Physical &amp; Social recharge.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E7E2] bg-white text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#5C6B67]">
            <BookOpen size={13} className="text-[#2F6F63]" />
            <span className="font-medium text-[#1E2A28]">Stress &amp; Workload Manager</span>
          </div>
          <p className="text-[10px] text-[#93A09B] mt-1">
            Built for university academic wellness
          </p>
        </div>
      </div>
    </div>
  );
};
