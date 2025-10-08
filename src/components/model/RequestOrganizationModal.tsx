'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import InputBox from '../../common/inputbox';
import FlagSvg from '@/assets/svg/flag-05';

interface RequestOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    setFormData: (data: any) => void;
    formData: any;
    handleSubmit: (e: React.FormEvent) => void;
}

const RequestOrganizationModal: React.FC<RequestOrganizationModalProps> = ({ isOpen, onClose, setFormData, formData, handleSubmit }) => {
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
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                                            <FlagSvg className="w-5 h-5" />
                                        </div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            Request New Organisation
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Organization Name */}
                                    <div className="space-y-2">
                                        <label className="flex justify-start items-start text-sm font-medium text-gray-700">
                                            Organization Name
                                        </label>
                                        <InputBox
                                            type="text"
                                            placeholder="Enter organization name"
                                            value={formData.organizationName}
                                            onChange={(value) => setFormData({ ...formData, organizationName: value })}
                                            variant="gray"
                                            size="md"
                                            minLength={3}
                                            maxLength={100}
                                        />
                                    </div>

                                    {/* Your Name */}
                                    <div className="space-y-2">
                                        <label className="flex justify-start items-start text-sm font-medium text-gray-700">
                                            Your Name
                                        </label>
                                        <InputBox
                                            type="text"
                                            placeholder="Enter your name"
                                            value={formData.yourName}
                                            onChange={(value) => setFormData({ ...formData, yourName: value })}
                                            variant="gray"
                                            size="md"
                                            minLength={3}
                                            maxLength={100}
                                        />
                                    </div>

                                    {/* Your Email */}
                                    <div className="space-y-2">
                                        <label className="flex justify-start items-start text-sm font-medium text-gray-700">
                                            Your Email
                                        </label>
                                        <InputBox
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.yourEmail}
                                            onChange={(value) => setFormData({ ...formData, yourEmail: value })}
                                            variant="gray"
                                            size="md"
                                        />
                                    </div>

                                    {/* Business Justification */}
                                    <div className="space-y-2">
                                        <label className="flex justify-start items-start text-sm font-medium text-gray-700">
                                            Business Justification
                                        </label>
                                        <InputBox
                                            type="textarea"
                                            placeholder="e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
                                            value={formData.businessJustification}
                                            onChange={(value) => setFormData({ ...formData, businessJustification: value })}
                                            variant="gray"
                                            size="md"
                                            rows={4}
                                        />
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!formData.organizationName || !formData.yourName || !formData.yourEmail || !formData.businessJustification}
                                            className={`px-6 py-2.5  rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md
                                            ${!formData.organizationName || !formData.yourName || !formData.yourEmail || !formData.businessJustification ? 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed' : 'bg-purple text-white'}`}
                                        >
                                            Submit request
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RequestOrganizationModal;
