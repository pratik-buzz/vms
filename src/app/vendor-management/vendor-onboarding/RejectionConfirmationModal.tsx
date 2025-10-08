'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface RejectionConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason?: string) => void
    title?: string
    message?: string
    requireReason?: boolean
}

const RejectionConfirmationModal: React.FC<RejectionConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Reject request",
    message = "Are you sure you want to reject this request?",
    requireReason = false
}) => {
    const [reason, setReason] = useState('')

    const handleConfirm = () => {
        if (requireReason) {
            if (reason.trim()) {
                onConfirm(reason.trim())
                setReason('')
            }
        } else {
            onConfirm()
        }
    }

    const handleClose = () => {
        setReason('')
        onClose()
    }

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
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Header with Icon and Title */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* Rejection Icon */}
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" />
                                <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" stroke-width="8" />
                                <path d="M32 22V21.2C32 20.0799 32 19.5198 31.782 19.092C31.5903 18.7157 31.2843 18.4097 30.908 18.218C30.4802 18 29.9201 18 28.8 18H27.2C26.0799 18 25.5198 18 25.092 18.218C24.7157 18.4097 24.4097 18.7157 24.218 19.092C24 19.5198 24 20.0799 24 21.2V22M26 27.5V32.5M30 27.5V32.5M19 22H37M35 22V33.2C35 34.8802 35 35.7202 34.673 36.362C34.3854 36.9265 33.9265 37.3854 33.362 37.673C32.7202 38 31.8802 38 30.2 38H25.8C24.1198 38 23.2798 38 22.638 37.673C22.0735 37.3854 21.6146 36.9265 21.327 36.362C21 35.7202 21 34.8802 21 33.2V22" stroke="#D92D20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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

                    {/* Reason Input - Only show if requireReason is true */}
                    {requireReason && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for rejection
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a reason for rejection"
                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                rows={3}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={requireReason && !reason.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RejectionConfirmationModal
