'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import TeamSvg from '@/assets/svg/team-brainstorming';
import BuildingsSvg from '@/assets/svg/buildings';
import UserPlus from '@/assets/svg/userPlus';
import Handshake from '@/assets/svg/handshake';
import Receipt from '@/assets/svg/receipt';

interface DashboardContentProps {
  onMenuToggle?: () => void;
}

const DashboardContent = ({ onMenuToggle }: DashboardContentProps) => {
  const router = useRouter();

  const todoItems = [
    {
      icon: BuildingsSvg,
      title: 'Setting up your organization',
      subtitle: 'Add details about your organization',
      completed: false,
      color: 'bg-purple-100 text-purple-600',
      hasButton: true
    },
    {
      icon: UserPlus,
      title: 'Add direct employees',
      subtitle: 'Add details about your organization',
      completed: false,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Handshake,
      title: 'Add & manage vendors',
      subtitle: 'Add vendors to get hiring & requisition updates',
      completed: false,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Receipt,
      title: 'Setup invoicing',
      subtitle: 'Add details about your organization',
      completed: false,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const handleBeginSetup = () => {
    
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-xl lg:text-[24px] font-[400] text-primary mb-2 leading-tight">
          Good Afternoon Karthik. Here are few things you could look at 👀
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Things to do */}
        <div className="bg-white rounded-xl shadow-sm border border-[#F2F4F7] p-6 lg:p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:mb-8 border-b border-[#F2F4F7] pb-4">Things to do</h2>

          <div className="space-y-4 lg:space-y-6">
            {todoItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 lg:space-x-4 group">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center border-2 border-[#E9D7FE]  flex-shrink-0`}>
                  <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                      <h3 className="font-[500] text-[#344054] group-hover:text-indigo-600 transition-colors text-sm lg:text-base">
                        {item.title}
                      </h3>
                    </div>
                    {item.hasButton && (
                      <button
                        onClick={handleBeginSetup}
                        className="px-3 py-1.5 lg:px-4 lg:py-2 border border-[#D0D5DD] text-gray-700 rounded-lg text-xs lg:text-sm font-[600]  transition-colors"
                      >
                        Begin setup
                      </button>
                    )}
                  </div>
                  <p className={`text-xs lg:text-sm text-[#667085] font-[400] leading-relaxed ${item.hasButton ? '-mt-2' : 'mb-0'}`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Take a quick tour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 ms-1">Take a quick tour</h2>

          <div className="text-center">
            <div className=" mb-6  flex justify-center items-center">
              <TeamSvg width={320} height={180} />
            </div>

            <div className="mb-6 lg:mb-8">
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed text-start mb-6 lg:mb-8 ms-1">
                Let us give you a quick tour of the platform before you get your hands dirty
              </p>
            </div>

            <div className="flex gap-3 justify-center w-full">
              <button className="bg-[#7F56D9] text-white w-[150px]  px-4 h-[36px] font-[600] text-[14px] rounded-lg">
                Begin tour
              </button>
              <button className="border border-[#D0D5DD] text-primary  w-full px-4 h-[36px] font-[600] text-[14px] rounded-lg">
                Will explore myself
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;