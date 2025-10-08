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
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Header with Icon and Title */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* Success Icon */}
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-6">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApprovalConfirmationModal
