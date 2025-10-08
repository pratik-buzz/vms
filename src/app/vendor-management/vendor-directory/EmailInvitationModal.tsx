'use client'

import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import InputBox from '@/common/inputbox';

interface EmailInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendInvitation: (email: string, subject: string, body: string) => void;
    title?: string;
}

const EmailInvitationModal: React.FC<EmailInvitationModalProps> = ({
    isOpen,
    onClose,
    onSendInvitation,
    title="Add vendor"
}) => {
    console.log(title, 'title')
    const [vendorEmail, setVendorEmail] = useState('olivia@untitledui.com');
    const [emailSubject, setEmailSubject] = useState('Invitation to onboard as a vendor');
    const [emailBody, setEmailBody] = useState(`To vendor,

Torem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim.

Link to begin onboarding

Thank you`);

    const handleSendInvitation = () => {
        onSendInvitation(vendorEmail, emailSubject, emailBody);
    };

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-purple px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Vendor Email ID Section */}
                                    <div>
                                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vendor email id
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={vendorEmail}
                                                onChange={(e) => setVendorEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                                placeholder="Enter vendor email"
                                            />
                                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                <HelpCircle size={16} />
                                            </button>
                                        </div> */}
                                        <InputBox
                                            type="email"
                                            value={vendorEmail}
                                            onChange={(e) => setVendorEmail(e)}
                                            placeholder="Enter vendor email"
                                            variant="gray"
                                            size="md"
                                            rightIcon={<HelpCircle size={16} />}
                                        />
                                    </div>

                                    {/* Email Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                            <div className="space-y-3">
                                                <div className='w-full'>
                                                    <span className="text-sm font-medium text-gray-600">Subject: </span>
                                                    <InputBox
                                                        type="text"
                                                        value={emailSubject}
                                                        onChange={(e) => setEmailSubject(e)}
                                                        variant="borderless"
                                                        size="md"
                                                        className='w-full border-none !bg-transparent'
                                                        
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-700 whitespace-pre-line">
                                                    <InputBox
                                                        type="textarea"
                                                        value={emailBody}
                                                        onChange={(e) => setEmailBody(e)}
                                                        variant="borderless"
                                                        size="md"
                                                        className='w-full border-none !bg-transparent' 
                                                        rows={10}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendInvitation}
                                        className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Send invitation
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

export default EmailInvitationModal;
