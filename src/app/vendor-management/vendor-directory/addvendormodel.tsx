'use client'

import React, { useState } from 'react';
import { X, Link, User } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { LinkSvg, UsereditSvg } from '@/assets/svg/onboardingOptionssvg';

interface AddvendormodelProps {
    isOpen: boolean;
    onClose: () => void;
    handleBeginOnboarding: (selectedOption: 'link' | 'manual' | null) => void;
}

const Addvendormodel: React.FC<AddvendormodelProps> = ({ isOpen, onClose, handleBeginOnboarding }) => {
    const [selectedOption, setSelectedOption] = useState<'link' | 'manual' | null>(null)

    const onboardingOptions = [
        {
            id: 'link' as const,
            title: 'Send onboarding link',
            description: 'An email will be sent to the vendor containing the onboarding link, allowing them to provide all the required details to complete their onboarding process on the platform',
            icon: LinkSvg
        },
        {
            id: 'manual' as const,
            title: 'Onboard manually',
            description: 'All the required details to complete the onboarding process are filled manually by you',
            icon: UsereditSvg
           }
    ]


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-50 p-8 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-800 text-center flex-1">
                                        How would you like to add vendor?
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {onboardingOptions.map((option) => {

                                        return (
                                            <div
                                                key={option.id}
                                                className={`bg-white border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 border-2`}
                                                onClick={() => setSelectedOption(option.id)}
                                            >
                                                <div className="flex justify-end items-start mb-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id
                                                        ? 'border-purple bg-purple'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {selectedOption === option.id && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-center items-start mb-4">
                                                    <div className="w-[100px] h-[100px] bg-[#F4EBFF] rounded-full flex items-center justify-center">
                                                        <option.icon />
                                                    </div>
                                                </div>
                                                <h4 className="text-[16px] text-center font-[600] text-[#000000] mb-2">
                                                    {option.title}
                                                </h4>
                                                <p className="text-[12px] font-[400] text-center text-[#667085] leading-relaxed">
                                                    {option.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Begin onboarding button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleBeginOnboarding(selectedOption)}
                                        disabled={!selectedOption}
                                        className={`px-8 py-3 bg-purple text-white  rounded-lg font-medium transition-all duration-200 ${selectedOption
                                            ? 'opacity-100'
                                            : 'cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        Begin onboarding
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Addvendormodel;
