'use client'

import AppLayout from '@/components/AppLayout'
import CustomDatePicker from '@/common/CustomDatePicker'
import React, { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronDown, MoreVertical, Check } from 'lucide-react'
import RejectedReasonModal from './rejectedreasonmodel'
import EmailInvitationModal from '../vendor-directory/EmailInvitationModal'
import DocumentViewerModal from './DocumentViewerModal'
import { fetchVendors, fetchVendorsPage, approveVendor, rejectVendor, resendInvitation, Vendor } from '@/common/services/vendorService'
import InfiniteScroll from 'react-infinite-scroll-component'
import CustomRangeDatePicker from '@/common/CustomRangeDatePicker'

// Helper function to get logo color based on vendor name
const getLogoColor = (name: string) => {
    const colors = [
        'bg-gradient-to-br from-purple to-blue-500',
        'bg-blue-500',
        'bg-gradient-to-br from-orange-500 to-blue-400',
        'bg-purple',
        'bg-green-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

// Helper function to calculate due date
const calculateDueDate = (createdAt: string, status: string) => {
    if (status === 'COMPLETED' || status === 'REJECTED') return '-'

    const created = new Date(createdAt)
    const due = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from creation
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return 'Overdue'
    if (diffDays === 1) return '1 day'
    return `${diffDays} days`
}

// Helper function to format date to ISO string without timezone issues
const formatDateToISO = (dateString: string): string => {
    if (!dateString) return ''
    // Parse the date components to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    // Create date in UTC to ensure consistent ISO format
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    return date.toISOString()
}

const VendorOnboardingPage = () => {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({})
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [rejectedreasonmodelopen, setRejectedreasonmodelopen] = useState<any>({
        isOpen: false,
        formData: {
            rejectedReason: '',
            companyName: ''
        }
    })
    const [resendinvitationmodelopen, setResendinvitationmodelopen] = useState<any>({
        isOpen: false,
        formData: {
            vendorId: '',
            companyName: ''
        }
    })
    const [documentViewerModal, setDocumentViewerModal] = useState<any>({
        isOpen: false,
        vendorId: '',
        vendorName: '',
        status: ''
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({})
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    })
    console.log(selectedActions, 'selectedActions')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch vendors data on component mount and when date range changes
    useEffect(() => {
        const loadVendors = async () => {
            try {
                setLoading(true)
                setError(null)

                // Convert dates to ISO format if they exist
                const dateFrom = dateRange.startDate ? formatDateToISO(dateRange.startDate) : undefined
                const dateTo = dateRange.endDate ? formatDateToISO(dateRange.endDate) : undefined

                console.log('Fetching vendors with date range:', {
                    originalDateRange: dateRange,
                    dateFrom,
                    dateTo,
                    formattedDateFrom: dateFrom,
                    formattedDateTo: dateTo
                })

                const response = await fetchVendorsPage(1, 10, 'DESC', dateFrom, dateTo)
                setVendors(response.vendors)
                setHasMore(response.hasMore)
                setTotalCount(response.totalCount)
                setCurrentPage(1)
            } catch (err) {
                setError('Failed to load vendors data')
                console.error('Error fetching vendors:', err)
            } finally {
                setLoading(false)
            }
        }

        loadVendors()
    }, [dateRange.startDate, dateRange.endDate, dateRange])

    // Load more vendors function
    const loadMoreVendors = async () => {
        if (loadingMore || !hasMore) return

        try {
            setLoadingMore(true)
            const nextPage = currentPage + 1
            const apiSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'

            // Convert dates to ISO format if they exist
            const dateFrom = dateRange.startDate ? formatDateToISO(dateRange.startDate) : undefined
            const dateTo = dateRange.endDate ? formatDateToISO(dateRange.endDate) : undefined

            const response = await fetchVendorsPage(nextPage, 10, apiSortOrder, dateFrom, dateTo)

            setVendors(prevVendors => [...prevVendors, ...response.vendors])
            setHasMore(response.hasMore)
            setCurrentPage(nextPage)
        } catch (err) {
            setError('Failed to load more vendors')
            console.error('Error fetching more vendors:', err)
        } finally {
            setLoadingMore(false)
        }
    }

    const handleSort = async () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrder(newSortOrder)

        try {
            setLoading(true)
            setError(null)
            const apiSortOrder = newSortOrder === 'asc' ? 'ASC' : 'DESC'

            // Convert dates to ISO format if they exist
            const dateFrom = dateRange.startDate ? formatDateToISO(dateRange.startDate) : undefined
            const dateTo = dateRange.endDate ? formatDateToISO(dateRange.endDate) : undefined

            const response = await fetchVendorsPage(1, 10, apiSortOrder, dateFrom, dateTo)
            setVendors(response.vendors)
            setHasMore(response.hasMore)
            setTotalCount(response.totalCount)
            setCurrentPage(1)
        } catch (err) {
            setError('Failed to sort vendors')
            console.error('Error sorting vendors:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id)
    }

    const handleActionClick = async (vendorId: string, actionLabel: string, companyName: string, vendorStatus: string) => {
        console.log(vendorId, actionLabel, 'vendorId, actionLabel')

        if (actionLabel === 'Approve') {
            try {
                setActionLoading(prev => ({ ...prev, [vendorId]: true }))
                await approveVendor(vendorId)

                // Update vendor status in the list
                setVendors(prevVendors =>
                    prevVendors.map(vendor =>
                        vendor.id === vendorId
                            ? { ...vendor, onboarding_status: 'COMPLETED' as const }
                            : vendor
                    )
                )

                console.log('Vendor approved successfully')
                // You can add a toast notification here
                // toast.success('Vendor approved successfully')
            } catch (error) {
                console.error('Error approving vendor:', error)
                setError('Failed to approve vendor')
            } finally {
                setActionLoading(prev => ({ ...prev, [vendorId]: false }))
            }
        } else if (actionLabel === 'Reject') {
            setRejectedreasonmodelopen({
                isOpen: true,
                formData: {
                    rejectedReason: '',
                    vendorId: vendorId,
                    companyName: companyName
                }
            })
        } else if (actionLabel === 'Re-send invitation link') {
            console.log(vendorId, 'vendorIdvendorIdvendorIdvendorIdvendorId')
            setResendinvitationmodelopen({
                isOpen: true,
                formData: {
                    vendorId: vendorId,
                    companyName: companyName
                }
            })
        } else if (actionLabel === 'View Documents') {
            setDocumentViewerModal({
                isOpen: true,
                vendorId: vendorId,
                vendorName: companyName,
                status: vendorStatus
            })
        }
        setSelectedActions(({
            [vendorId]: actionLabel
        }))
        setActiveDropdown(null) // Close dropdown after selection
    }

    // Get actions based on status
    const getActionsForStatus = (status: string) => {
        switch (status) {
            case 'PENDING':
                return [
                    { label: 'View Documents', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50', enabled: true }
                    // { label: 'Approve', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-purple-50' },
                    // { label: 'Reject', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50' }
                ]
            case 'IN_PROGRESS':
                return [
                    { label: 'View Documents', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50', enabled: true }
                    // { label: 'Approve', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-purple-50' },
                    // { label: 'Reject', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50' },
                    // { label: 'View Documents', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50' }
                ]
            case 'REJECTED':
                return [
                    { label: 'View Documents', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50', enabled: true }
                    // { label: 'Re-send invitation link', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50' }
                ]
            case 'COMPLETED':
                return [
                    { label: 'View Documents', icon: Check, color: 'text-[#344054]', hoverColor: 'hover:bg-gray-50', enabled: true }
                ] // No actions for completed
            default:
                return []
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        const getStatusConfig = (status: string) => {
            switch (status) {
                case 'COMPLETED':
                    return {
                        dotColor: 'bg-[#17B26A]',
                        textColor: 'text-[#067647]',
                        bgColor: 'bg-[#ECFDF3]',
                        borderColor: 'border-[#ABEFC6]',
                        displayText: 'Completed'
                    }
                case 'REJECTED':
                    return {
                        dotColor: 'bg-[#F04438]',
                        textColor: 'text-[#B42318]',
                        bgColor: 'bg-[#FEF3F2]',
                        borderColor: 'border-[#FECDCA]',
                        displayText: 'Rejected'
                    }
                case 'IN_PROGRESS':
                    return {
                        dotColor: 'bg-[#F79009]',
                        textColor: 'text-[#B54708]',
                        bgColor: 'bg-[#FFFAEB]',
                        borderColor: 'border-[#FEDF89]',
                        displayText: 'In progress'
                    }
                case 'PENDING':
                    return {
                        dotColor: 'bg-[#667085]',
                        textColor: 'text-[#344054]',
                        bgColor: 'bg-[#F9FAFB]',
                        borderColor: 'border-[#EAECF0]',
                        displayText: 'Pending'
                    }
                default:
                    return {
                        dotColor: 'bg-gray-500',
                        textColor: 'text-gray-600',
                        bgColor: 'bg-gray-50',
                        borderColor: 'border-[#F2F4F7]',
                        displayText: status
                    }
            }
        }

        const config = getStatusConfig(status)

        return (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full border ${config.borderColor} ${config.bgColor}`}>
                <div className={`w-2 h-2 rounded-full ${config.dotColor} mr-2`}></div>
                <span className={`text-[12px] font-[500] ${config.textColor}`}>{config.displayText}</span>
            </div>
        )
    }

    const handleReject = async (formData: any) => {
        console.log(formData, 'formData')
        try {
            setActionLoading(prev => ({ ...prev, [formData.vendorId]: true }))
            await rejectVendor(formData.vendorId, formData.rejectedReason)

            // Update vendor status in the list
            setVendors(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === formData.vendorId
                        ? { ...vendor, onboarding_status: 'REJECTED' as const }
                        : vendor
                )
            )

            console.log('Vendor rejected successfully')
            // You can add a toast notification here
            // toast.success('Vendor rejected successfully')
            setRejectedreasonmodelopen({ isOpen: false, formData: { rejectedReason: '', companyName: '' } })
        } catch (error) {
            console.error('Error rejecting vendor:', error)
            setError('Failed to reject vendor')
        } finally {
            setActionLoading(prev => ({ ...prev, [formData.vendorId]: false }))
        }
    }

    const handleResendInvitation = async (email: string, subject: string, body: string) => {
        try {
            const vendorId = resendinvitationmodelopen.formData.vendorId
            setActionLoading(prev => ({ ...prev, [vendorId]: true }))

            await resendInvitation(vendorId, email, subject, body)

            // Update vendor status to PENDING after successful resend
            setVendors(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === vendorId
                        ? { ...vendor, onboarding_status: 'PENDING' as const }
                        : vendor
                )
            )

            console.log('Invitation resent successfully')
            // You can add a toast notification here
            // toast.success('Invitation resent successfully')

            // Close the modal
            setResendinvitationmodelopen({ isOpen: false, formData: { vendorId: '', companyName: '' } })
        } catch (error) {
            console.error('Error resending invitation:', error)
            setError('Failed to resend invitation')
        } finally {
            setActionLoading(prev => ({ ...prev, [resendinvitationmodelopen.formData.vendorId]: false }))
        }
    }

    return (
        <AppLayout title='Vendor management'>
            <div className="px-3 sm:px-4 lg:px-6">
                {/* Header with title and date picker */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-[18px] font-[600] text-[#344054]">Onboarding</h1>
                    <div className="w-full sm:w-64">
                        <CustomRangeDatePicker
                            value={dateRange}
                            onChange={(newDateRange) => setDateRange(newDateRange)}
                            placeholder="Select date range"
                        />
                    </div>
                </div>

                {/* Onboarding Status Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Onboarding status</h2>
                        {totalCount > 0 && (
                            <div className="text-sm text-gray-500">
                                Showing {vendors.length} of {totalCount} vendors
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <InfiniteScroll
                            dataLength={vendors.length}
                            next={loadMoreVendors}
                            hasMore={hasMore}
                            loader={
                                <div className="flex justify-center py-4">
                                    <div className="flex items-center text-gray-600">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple mr-2"></div>
                                        <span>Loading more vendors...</span>
                                    </div>
                                </div>
                            }
                            endMessage={
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    All vendors loaded
                                </div>
                            }
                            scrollableTarget="scrollableDiv"
                            style={{ overflow: 'visible' }}
                            scrollThreshold={0.8}
                            initialScrollY={0}
                        >
                            <table className="w-full">
                                {/* Table Header */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            <button
                                                onClick={handleSort}
                                                disabled={loading}
                                                className="flex items-center gap-2 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Company
                                                {loading ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-purple"></div>
                                                ) : (
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            Onboarding method
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            Started on
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            Due by
                                        </th>
                                        <th className="px-6 py-3 text-right text-[12px] font-[500] text-[#475467] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {
                                        vendors.map((vendor) => {
                                            const companyName = vendor.full_name || vendor.short_name || vendor.onboarding_email
                                            const companyInitial = companyName ? companyName.charAt(0).toUpperCase() : 'Unknown'
                                            const logoColor = getLogoColor(companyName || '')
                                            const startedOn = formatDate(vendor.created_at)
                                            const dueBy = calculateDueDate(vendor.created_at, vendor.onboarding_status)

                                            return (
                                                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* Company Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className={`w-10 h-10 rounded-full ${logoColor} flex items-center justify-center text-white font-semibold text-sm mr-3`}>
                                                                {companyInitial}
                                                            </div>
                                                            <div>
                                                                <div className="text-[14px] font-[600] text-[#101828]">
                                                                    {companyName}
                                                                </div>
                                                                <div className="text-[14px] font-[400] text-[#475467]">
                                                                    Vendor ID: {vendor.vendor_id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Status Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={vendor.onboarding_status} />
                                                    </td>

                                                    {/* Onboarding Method Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-[400] text-[#475467]">
                                                        {vendor.onboarded_by_admin ? 'Admin onboarding' : 'Self onboarding'}
                                                    </td>

                                                    {/* Started On Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-[400] text-[#475467]">
                                                        {startedOn}
                                                    </td>

                                                    {/* Due By Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-[400] text-[#475467]">
                                                        {dueBy}
                                                    </td>

                                                    {/* Actions Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium relative">
                                                        {/* {vendor.onboarding_status === 'PENDING' ? (
                                                            <> */}
                                                        <button
                                                            onClick={() => toggleDropdown(vendor.id)}
                                                            className="text-black hover:text-gray-600 transition-colors"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {activeDropdown === vendor.id && (
                                                            <div
                                                                ref={dropdownRef}
                                                                className="absolute right-6 top-0 mt-8 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                                                style={{ width: '140px' }}
                                                            >
                                                                <div className="py-1">
                                                                    {getActionsForStatus(vendor.onboarding_status).map((action, index) => {
                                                                        const isSelected = selectedActions[vendor.id] === action.label
                                                                        const isLoading = actionLoading[vendor.id]
                                                                        const isDisabled = isLoading || !action.enabled
                                                                        return (
                                                                            <button
                                                                                key={index}
                                                                                onClick={() => action.enabled ? handleActionClick(vendor.id, action.label, companyName || '', vendor.onboarding_status) : null}
                                                                                disabled={isDisabled}
                                                                                className={`w-full px-4 py-2 text-left text-sm ${action.color} ${action.enabled ? action.hoverColor : 'cursor-not-allowed opacity-50'} flex items-center justify-between ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                            >
                                                                                {isLoading ? (
                                                                                    <div className="flex items-center">
                                                                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-purple mr-2"></div>
                                                                                        Processing...
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        {action.label}
                                                                                        {isSelected && <Check className="w-4 h-4 text-purple" />}
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* </>
                                                        ) : (
                                                            <span className="text-gray-300 cursor-not-allowed flex items-center justify-end">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </span>
                                                        )} */}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </InfiniteScroll>
                    </div>

                </div>
                <RejectedReasonModal
                    isOpen={rejectedreasonmodelopen.isOpen}
                    onClose={() => setRejectedreasonmodelopen({ isOpen: false, formData: { rejectedReason: '', companyName: '' } })}
                    formData={rejectedreasonmodelopen.formData}
                    handleReject={handleReject}
                />
                <EmailInvitationModal
                    isOpen={resendinvitationmodelopen.isOpen}
                    onClose={() => setResendinvitationmodelopen({ isOpen: false, formData: { vendorId: '', companyName: '' } })}
                    onSendInvitation={handleResendInvitation}
                    title="Resend invitation"
                />
                <DocumentViewerModal
                    isOpen={documentViewerModal.isOpen}
                    onClose={() => setDocumentViewerModal({ isOpen: false, vendorId: '', vendorName: '' })}
                    vendorId={documentViewerModal.vendorId}
                    vendorName={documentViewerModal.vendorName}
                    vendorStatus={documentViewerModal.status}
                />
            </div>
        </AppLayout>
    )
}

export default VendorOnboardingPage