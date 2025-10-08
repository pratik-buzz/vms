'use client'

import React from 'react';
import CheckSvg from '@/assets/svg/checkSvg';

interface StepData {
    id: number;
    title: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

interface EngineerSidebarProps {
    step: number;
    setStep: (step: number) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    stepsData: StepData[];
    title?: string;
    completedCount?: number;
    totalCount?: number;
}

const InnerSidebar: React.FC<EngineerSidebarProps> = ({
    step,
    setStep,
    isSidebarOpen,
    setIsSidebarOpen,
    stepsData,
    title = "STEPS TO BE COMPLETED",
    completedCount = 0,
    totalCount = 3
}) => {
    // Determine which steps are completed based on completedCount
    const isStepCompleted = (stepId: number) => {
        return stepId <= completedCount;
    };

    return (
        <>
            {/* Mobile overlay/backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-72 sm:w-80 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto`} style={{ top: '0px', height: 'calc(100vh)' }}>
                {/* Mobile close button */}
                <div className="lg:hidden mb-4 flex justify-end">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-[12px] font-[500] text-[#98A2B3] mb-6">{title} ({completedCount}/{totalCount})</h3>
                    <div className="space-y-2">
                        {stepsData.map((stepData, index) => {
                            const isCompleted = isStepCompleted(stepData.id);
                            const isActive = step === stepData.id;

                            return (
                                <div key={stepData.id}>
                                    <div
                                        className={`flex items-center space-x-3 cursor-pointer rounded-lg `}
                                        onClick={() => {
                                            setStep(stepData.id);
                                            setIsSidebarOpen(false); // Close sidebar on mobile when step is clicked
                                        }}
                                    >
                                        <div className={`w-[40px] h-[40px] ${isActive ? 'border border-[#E9D7FE]' : isCompleted ? 'border border-[#ABEFC6] bg-[#ECFDF3]' : 'border border-[#D0D5DD]'} rounded-lg flex items-center justify-center`}>
                                            {isCompleted ? (
                                                <CheckSvg width={20} height={20} color="white" />
                                            ) : (
                                                stepData.icon
                                            )}
                                        </div>
                                        <span className={`text-[14px] font-[600] ${isActive ? 'text-[#344054]' : 'text-gray-500'}`}>
                                            {stepData.title}
                                        </span>
                                    </div>
                                    {/* Divider line between steps */}
                                    {index < stepsData.length - 1 && (
                                        <div className="flex justify-start ms-5">
                                            <div className="w-0.5 h-2  bg-gray-300 relative top-[3.5px]"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default InnerSidebar;
