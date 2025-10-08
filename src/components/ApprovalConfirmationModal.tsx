'use client'

import React from 'react'
import { X } from 'lucide-react'

interface ApprovalConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
}

const ApprovalConfirmationModal: React.FC<ApprovalConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Approve request",
    message = "Are you sure you want to approve this request?"
}) => {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[2000] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Modal Content */}
                    <div className="p-6">
                        {/* Success Icon */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-sm text-gray-600 text-center mb-6">
                            {message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ApprovalConfirmationModal
