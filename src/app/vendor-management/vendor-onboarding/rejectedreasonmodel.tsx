import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, AlertTriangle } from 'lucide-react'

interface RejectedReasonModalProps {
    isOpen: boolean
    onClose: () => void
    formData: {
        rejectedReason: string
        vendorId: number
        companyName: string
    }
    handleReject: (formData: any) => void
}

const RejectedReasonModal: React.FC<RejectedReasonModalProps> = ({
    isOpen,
    onClose,
    formData,
    handleReject
}) => {
    const [selectedReason, setSelectedReason] = useState('')
    const [otherReason, setOtherReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const rejectionReasons = [
        'Incomplete documentation',
        'Invalid business information',
        'Security concerns',
        'Duplicate application',
        'Failed verification',
        'Other'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const finalReason = selectedReason === 'Other' && otherReason.trim()
                ? otherReason
                : selectedReason

            await handleReject({
                ...formData,
                rejectedReason: finalReason
            })
            onClose()
        } catch (error) {
            console.error('Error rejecting vendor:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <div className="text-lg text-start font-semibold text-gray-900">
                                                Reject Vendor
                                            </div>
                                            <p className="text-sm text-gray-500">Provide reason for rejection</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2 text-start">Company: {formData.companyName}</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-3 text-start">
                                                Select rejection reason
                                            </label>
                                            <div className="space-y-2">
                                                {rejectionReasons.map((reason) => (
                                                    <label key={reason} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="rejectionReason"
                                                            value={reason}
                                                            checked={selectedReason === reason}
                                                            onChange={(e) => setSelectedReason(e.target.value)}
                                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                        />
                                                        <span className="ml-3 text-sm text-gray-700">{reason}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedReason === 'Other' && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                                                    Please specify the reason
                                                </label>
                                                <textarea
                                                    value={otherReason}
                                                    onChange={(e) => setOtherReason(e.target.value)}
                                                    placeholder="Please provide the specific reason for rejection..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                                    rows={3}
                                                />
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!selectedReason.trim() || (selectedReason === 'Other' && !otherReason.trim()) || isSubmitting}
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isSubmitting ? 'Rejecting...' : 'Reject Vendor'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default RejectedReasonModal  