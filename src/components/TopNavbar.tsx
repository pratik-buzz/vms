'use client'

import React from 'react';
import { Search, Zap, Settings, Bell, HelpCircle, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuestionsSvg from '@/assets/svg/questionsSvg';
import BellSvg from '@/assets/svg/bellSvg';
import SettingsSvg from '@/assets/svg/settings';

interface TopNavbarProps {
  onMenuToggle?: () => void;
}

const TopNavbar = ({ onMenuToggle }: TopNavbarProps) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button and company name */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Company name */}
          <span className='leading-[20px] text-primary font-normal text-[14px] truncate max-w-[200px] sm:max-w-none'>
            Buzzworks business service...
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Quick Actions - hidden on mobile */}
          <button className="hidden sm:flex items-center justify-center gap-2 h-[36px] w-[145px] bg-white border border-gray-300 rounded-lg text-sm text-primary transition-colors font-[600]">
            <Zap className="w-4 h-4" />
            <span>Quick actions</span>
          </button>
          <span className='hidden sm:block text-[#F2F4F7] font-medium text-[25px] ps-2'>|</span>

          {/* Icon Buttons */}
          {/* <button
            className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {router.push('/settings'); }}
          >
            <SettingsSvg />
          </button> */}
          <button className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <BellSvg />
          </button>
          <button className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <QuestionsSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;