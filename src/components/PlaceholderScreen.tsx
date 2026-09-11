import React from 'react';
import { ScreenType } from '../types';
import { HeartPulse, BellRing, ArrowLeft, Menu, Clock, Sparkles } from 'lucide-react';

interface PlaceholderScreenProps {
  type: 'health_stress' | 'guidance_alerts';
  onBack: () => void;
  onOpenMenu: () => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  type,
  onBack,
  onOpenMenu,
}) => {
  const isHealth = type === 'health_stress';

  const content = isHealth
    ? {
        title: 'Health and stress',
        description:
          'Connects to a smartwatch to read sleep and activity, then feeds that into your daily cortisol reading. Less sleep raises every meter; more sleep lowers them and frees up time.',
        icon: HeartPulse,
        iconBg: 'bg-[#C68A2E]/10 text-[#C68A2E] border-[#C68A2E]/20',
        badge: 'Planned for a later build',
        previewTip: 'Upcoming integrations: Apple Health, Oura, Whoop, and Garmin Connect.',
      }
    : {
        title: 'Guidance and alerts',
        description:
          "Watches for task switching and rising load, then suggests swapping, postponing, or extending a task, with a short AI note on why it's worth doing.",
        icon: BellRing,
        iconBg: 'bg-[#7B6CC4]/10 text-[#7B6CC4] border-[#7B6CC4]/20',
        badge: 'Planned for a later build',
        previewTip: 'Active proactive load warnings will alert you before cognitive fatigue hits.',
      };

  const IconComponent = content.icon;

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#F0F3EF] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#F0F3EF]/90 backdrop-blur-md px-4 py-3.5 border-b border-[#E2E7E2] flex items-center justify-between">
        <button
          id="placeholder-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[#5C6B67] hover:text-[#1E2A28] transition-colors p-1.5 rounded-lg hover:bg-white/60"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <button
          id="placeholder-menu-btn"
          onClick={onOpenMenu}
          className="p-2 rounded-xl text-[#1E2A28] hover:bg-white/60 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto">
        {/* Centered Icon with subtle layered ring */}
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xs ${content.iconBg}`}
          >
            <IconComponent size={38} strokeWidth={1.75} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFFFFF] border border-[#E2E7E2] flex items-center justify-center shadow-xs text-[#2F6F63]">
            <Sparkles size={13} />
          </div>
        </div>

        {/* Small "Planned for a later build" pill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E7E2] text-[12px] font-medium text-[#5C6B67] mb-4 shadow-2xs">
          <Clock size={12} className="text-[#93A09B]" />
          <span>{content.badge}</span>
        </div>

        {/* Headline in serif font Newsreader */}
        <h1 className="font-newsreader text-3xl font-normal text-[#1E2A28] tracking-tight mb-3">
          {content.title}
        </h1>

        {/* Short description */}
        <p className="text-sm leading-relaxed text-[#5C6B67] max-w-xs mb-8">
          {content.description}
        </p>

        {/* Preview card */}
        <div className="w-full bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E7E2] text-left shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93A09B] block mb-1">
            System Preview
          </span>
          <p className="text-xs text-[#1E2A28] leading-relaxed">
            {content.previewTip}
          </p>
        </div>

        {/* Return to Dashboard button */}
        <button
          onClick={onBack}
          className="mt-8 px-6 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E7E2] text-sm font-medium text-[#1E2A28] hover:bg-[#F0F3EF] transition-all shadow-2xs"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="text-center text-xs text-[#93A09B]">
        Stress &amp; Workload Manager
      </div>
    </div>
  );
};
