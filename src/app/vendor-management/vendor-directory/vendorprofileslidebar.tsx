'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, MoreVertical } from 'lucide-react'
import { fetchVendorById } from '../../../common/services/vendorService'

interface VendorProfileSlidebarProps {
    isOpen: boolean
    onClose: () => void
    vendorId: string
    vendorIcon?: React.ReactNode
}

const VendorProfileSlidebar: React.FC<VendorProfileSlidebarProps> = ({
    isOpen,
    onClose,
    vendorId,
    vendorIcon
}) => {
    const [activeTab, setActiveTab] = useState<'basic' | 'performance'>('basic')
    const [vendorData, setVendorData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)



    const fetchVendorData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetchVendorById(vendorId)
            setVendorData(response.data)
        } catch (err) {
            console.error('Error fetching vendor data:', err)
            setError('Failed to fetch vendor data')
        } finally {
            setLoading(false)
        }
    }, [vendorId])

    useEffect(() => {
        if (isOpen && vendorId) {
            fetchVendorData()
        }
    }, [isOpen, vendorId, fetchVendorData])

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[1000] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slidebar */}
            <div className={`fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="bg-[#7F56D9] px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-white text-lg font-semibold">Vendor profile</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Vendor Info Section */}
                <div className="px-6 py-6 bg-white flex-shrink-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-red-500 text-center">
                                <p className="text-sm">{error}</p>
                                <button
                                    onClick={fetchVendorData}
                                    className="mt-2 px-4 py-2 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6B46C1] transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : vendorData ? (
                        <div className="flex items-center gap-4">
                            {/* Vendor Logo */}
                            <div className="w-12 h-12 bg-[#7F56D9] rounded-lg flex items-center justify-center flex-shrink-0">
                                {vendorIcon || <span className="text-white font-semibold text-lg">
                                    {vendorData.full_name ? vendorData.full_name.charAt(0).toUpperCase() : 'V'}
                                </span>}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {vendorData.full_name || vendorData.short_name || 'Unknown'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    GSTIN : {vendorData.gst?.gstin || 'Not Available'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Status:
                                    </span>
                                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1">
                                        <div className={`w-2 h-2 rounded-full ${vendorData.is_active ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                        <span className="text-sm text-gray-600">
                                            {vendorData.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded ml-2">
                                    <MoreVertical size={16} className="text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'basic'
                            ? 'text-[#7F56D9] border-b-2 border-[#7F56D9]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Basic details
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'performance'
                            ? 'text-[#7F56D9] border-b-2 border-[#7F56D9]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Performance details
                    </button>
                </div>

                {/* Content - Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-red-500 text-center">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    ) : vendorData ? (
                        activeTab === 'basic' ? (
                            <div className="bg-[#FFFFFF] rounded-lg border border-[#EAECF0] shadow-sm p-6">
                                {/* Contact Details */}
                                <div className="mb-8">
                                    <h4 className="text-[16px] font-[500] text-[#000000] mb-6">Contact details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">POC</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.pocs?.[0]?.name || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Email</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.pocs?.[0]?.email || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Contact number</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.pocs?.[0]?.phone || 'Not Available'}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Address</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.addresses?.[0] ?
                                                    `${vendorData.addresses[0].address_line_1 || ''} ${vendorData.addresses[0].address_line_2 || ''} ${vendorData.addresses[0].city || ''} ${vendorData.addresses[0].state || ''} ${vendorData.addresses[0].pincode || ''}`.trim() || 'Not Available'
                                                    : 'Not Available'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contract Details */}
                                <div>
                                    <h4 className="text-[16px] font-[500] text-[#000000] mb-6">Contract details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Start date</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.contract?.start_date ?
                                                    new Date(vendorData.contract.start_date).toLocaleDateString('en-GB') : 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">End date</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.contract?.end_date ?
                                                    new Date(vendorData.contract.end_date).toLocaleDateString('en-GB') : 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Tenure</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.contract?.duration || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Attachment</div>
                                            <a
                                                href="#"
                                                className="text-[14px] font-[400] text-[#7F56D9] hover:underline"
                                            >
                                                {vendorData.contract?.document_name || 'Not Available'}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#FFFFFF] rounded-lg border border-[#EAECF0] shadow-sm p-6">
                                <h4 className="text-[16px] font-[500] text-[#000000] mb-6">Performance details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Onboarding Status</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.onboarding_status || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Vendor ID</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.vendor_id || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Created Date</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.created_at ?
                                                    new Date(vendorData.created_at).toLocaleDateString('en-GB') : 'Not Available'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">PAN</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.pan || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">TAN</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.tan || 'Not Available'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-[#667085] mb-1">Last Updated</div>
                                            <div className="text-[14px] font-[400] text-[#344054]">
                                                {vendorData.updated_at ?
                                                    new Date(vendorData.updated_at).toLocaleDateString('en-GB') : 'Not Available'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : null}
                </div>

                {/* Action Buttons - Fixed Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className=" w-[100px] h-[40px] px-4  text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Handle save and proceed logic here
                                console.log('Save & proceed clicked')
                            }}
                            className=" w-[139px] h-[40px] px-4  text-sm font-medium text-white bg-[#7F56D9] rounded-lg hover:bg-[#6B46C1] transition-colors"
                        >
                            Save & proceed
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VendorProfileSlidebar
