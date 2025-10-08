'use client'

import AppLayout from '@/components/AppLayout'
import CustomDatePicker from '@/common/CustomDatePicker'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    CloudCog,
    MoreHorizontal,
    Plus,
    RefreshCw,
} from 'lucide-react'
// Removed Backgroundsvg import since we're using random colors now
// Removed unused SVG imports since we're using initials now
import Addvendormodel from './addvendormodel'
import EmailInvitationModal from './EmailInvitationModal'
import ManualVendorOnboardingModal from './ManualVendorOnboardingModal'
import VendorProfileSlidebar from './vendorprofileslidebar'
import { Get, Post } from '@/common/axios/api'
import { API_GET, API_POST } from '@/common/constant/api'
import CustomRangeDatePicker from '@/common/CustomRangeDatePicker'
import Backgroundsvg from '@/assets/svg/backgroundsvg'
import { useToast } from '@/contexts/ToastContext'

const VendorDirectoryPage = () => {
    const { showSuccess } = useToast();

    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    })
    const [selectedStatCard, setSelectedStatCard] = useState<string | null>("all")
    const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false)
    const [isEmailInvitationModalOpen, setIsEmailInvitationModalOpen] = useState(false)
    const [isManualVendorModalOpen, setIsManualVendorModalOpen] = useState(false)
    const [isVendorProfileSlidebarOpen, setIsVendorProfileSlidebarOpen] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState<any>(null)
    const [vendors, setVendors] = useState<any[]>([])
    console.log(vendors, 'vendorsvendorsvendorsvendors')
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [vendorStats, setVendorStats] = useState<any>({
        all: 0,
        active: 0,
        exited: 0,
        terminated: 0
    })

    // Function to get vendor initial (first letter of name)
    const getVendorInitial = (vendor: any) => {
        const name = vendor.full_name || vendor.short_name || 'Unknown'
        return name.charAt(0).toUpperCase()
    }

    // Function to get random background color
    const getRandomBackgroundColor = (index: number) => {
        const colors = [
            'bg-[#7F56D9]',
            'bg-[#6941C6]',
            'bg-[#10B981]',
            'bg-[#EF4444]',
            'bg-[#F59E0B]',
            'bg-[#EC4899]',
            'bg-[#10B981]',
            'bg-[#F59E0B]',
            'bg-[#EC4899]',
            'bg-[#10B981]'
        ]
        return colors[index % colors.length]
    }

    const handleBeginOnboarding = (selectedOption: 'link' | 'manual' | null) => {
        console.log('Selected option:', selectedOption);
        setIsAddVendorModalOpen(false)

        // If user selected "Send onboarding link", open the email invitation modal
        if (selectedOption === 'link') {
            setIsEmailInvitationModalOpen(true)
        }
        // If user selected "Onboard manually", open the manual vendor modal
        else if (selectedOption === 'manual') {
            setIsManualVendorModalOpen(true);
        }
    };

    const handleSendInvitation = async (email: string, subject: string, body: string) => {
        console.log('Sending invitation:', { email, subject, body });
        const data = {
            email: email,
            subject: subject,
            content: body
        }

        const response = await Post<any>(API_POST.VENDORS_ONBOARDING_SEND_INVITATION, data)
        console.log(response.data.code, 'responseresponseresponseresponseresponse')
        if (response.data.code === 201) {
            setIsEmailInvitationModalOpen(false)
            showSuccess('Invitation sent successfully!');
        }
        // Add your API call to send the invitation email here
        // For now, just log the data
    };


    const handleVendorCardClick = (vendor: any) => {
        console.log('Vendor card clicked:', vendor);
        setSelectedVendor(vendor);
        setIsVendorProfileSlidebarOpen(true);
    };

    const handleCloseVendorProfile = () => {
        setIsVendorProfileSlidebarOpen(false);
        setSelectedVendor(null);
    };

    const getVendorStats = async () => {
        try {
            const response = await Get<any>(API_GET.VENDORS_STATUS_COUNTS)
            setVendorStats(response.data?.data)
        } catch (error) {
            console.error('Error fetching vendor stats:', error)
        }
    }

    const getVendors = async (page: number = 1, append: boolean = false) => {
        if (append) {
            setLoadingMore(true)
        } else {
            setLoading(true)
            setCurrentPage(1)
        }
        setError(null)

        try {
            const params: any = {
                page: page,
                pageSize: 10,
                vendor_status: selectedStatCard
            }

            // Add date range parameters if available
            if (dateRange.startDate && dateRange.endDate) {
                params.dateFrom = new Date(dateRange.startDate).toISOString()
                params.dateTo = new Date(dateRange.endDate).toISOString()
            }

            const response = await Get<any>(API_GET.VENDORS, params)

            if (response.data?.data?.rows) {
                // Transform API data to match component expectations
                const transformedVendors = response.data.data.rows.map((vendor: any, index: number) => ({
                    id: vendor.id,
                    vendor_id: vendor.vendor_id,
                    name: vendor.full_name || vendor.short_name ,
                    short_name: vendor.short_name,
                    full_name: vendor.full_name,
                    icon: getVendorInitial(vendor),
                    backgroundColor: getRandomBackgroundColor((append ? vendors.length : 0) + index),
                    status: vendor.is_active ? 'Active' : 'Inactive',
                    onboarding_status: vendor.onboarding_status,
                    is_active: vendor.is_active,
                    exited: vendor.exited,
                    terminated: vendor.terminated,
                    pan: vendor.pan,
                    tan: vendor.tan,
                    created_at: vendor.created_at,
                    updated_at: vendor.updated_at,
                    onboarding_email: vendor.onboarding_email,
                    options: ['Extend contract', 'Terminate the contract', 'Issue warning letter']
                }))

                const totalCount = response.data.data.count || 0
                const currentVendorsLength = append ? vendors.length + transformedVendors.length : transformedVendors.length

                if (append) {
                    setVendors(prev => [...prev, ...transformedVendors])
                } else {
                    setVendors(transformedVendors)
                }

                // Update pagination state
                setTotalCount(totalCount)
                setCurrentPage(page)
                setHasMore(currentVendorsLength < totalCount && transformedVendors.length === 10)
            }
        } catch (error) {
            console.error('Error fetching vendors:', error)
            setError('Failed to fetch vendors. Please try again.')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMoreVendors = () => {
        if (!loadingMore && hasMore && !loading) {
            getVendors(currentPage + 1, true)
        }
    }

    const handleRefresh = () => {
        setVendors([])
        setCurrentPage(1)
        setHasMore(true)
        setError(null)
        getVendors(1, false)
    }

    // Initial load
    useEffect(() => {
        getVendorStats()
        getVendors()
    }, [])

    // Refetch vendors when date range or selected stat card changes
    useEffect(() => {
        setVendors([])
        setCurrentPage(1)
        setHasMore(true)
        getVendors(1, false)
    }, [dateRange, selectedStatCard])

    // Remove manual scroll detection since we're using react-infinite-scroll-component
    return (
        <AppLayout >
            <div className="px-3 sm:px-4 lg:px-6 mb-10">
                {/* Header Section */}
                <div className="mb-8 mt-8 ">
                    {/* Main Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Vendor management</h1>
                        </div>
                        <button onClick={() => setIsAddVendorModalOpen(true)} className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Plus size={16} />
                            Add vendor
                        </button>
                    </div>

                    {/* Sub Header */}
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-lg font-medium text-gray-900">Directory</h2>
                        <div className="w-full sm:w-64">
                            <CustomRangeDatePicker
                                value={dateRange}
                                onChange={(newDateRange) => setDateRange(newDateRange)}
                                placeholder="Select date range"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div
                        className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedStatCard === 'all'
                            ? 'border-[#7F56D9]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedStatCard(selectedStatCard === 'all' ? null : 'all')}
                    >
                        <div className="text-[14px] font-[400] text-[#344054] mb-1">All vendors</div>
                        <div className="text-[24px] font-[400] text-[#000000]">{vendorStats.all}</div>
                    </div>
                    <div
                        className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedStatCard === 'active'
                            ? 'border-[#7F56D9]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedStatCard(selectedStatCard === 'active' ? null : 'active')}
                    >
                        <div className="text-[14px] font-[400] text-[#344054] mb-1">Active vendors</div>
                        <div className="text-[24px] font-[400] text-[#000000]">{vendorStats.active}</div>
                    </div>
                    <div
                        className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedStatCard === 'exited'
                            ? 'border-[#7F56D9]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedStatCard(selectedStatCard === 'exited' ? null : 'exited')}
                    >
                        <div className="text-[14px] font-[400] text-[#344054] mb-1">Exited vendors</div>
                        <div className="text-[24px] font-[400] text-[#000000]">{vendorStats.exited}</div>
                    </div>
                    <div
                        className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedStatCard === 'terminated'
                            ? 'border-[#7F56D9]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedStatCard(selectedStatCard === 'terminated' ? null : 'terminated')}
                    >
                        <div className="text-[14px] font-[400] text-[#344054] mb-1">Terminated/Disciplinary issues</div>
                        <div className="text-[24px] font-[400] text-[#000000]">{vendorStats.terminated}</div>
                    </div>
                </div>

                {/* Vendor Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-500">Loading vendors...</div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button
                            onClick={handleRefresh}
                            className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-500">No vendors found</div>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={vendors.length}
                        next={loadMoreVendors}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center items-center py-8">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                    Loading more vendors...
                                </div>
                            </div>
                        }
                        endMessage={
                            <div className="text-center py-8">
                                <div className="text-gray-500 text-sm">
                                    Showing {vendors.length} of {totalCount} vendors
                                </div>
                            </div>
                        }
                        scrollThreshold={0.8}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vendors.map((vendor) => (
                                <VendorCard key={vendor.id} vendor={vendor} onVendorClick={handleVendorCardClick} />
                            ))}
                        </div>
                    </InfiniteScroll>
                )}

                <Addvendormodel isOpen={isAddVendorModalOpen} onClose={() => setIsAddVendorModalOpen(false)} handleBeginOnboarding={handleBeginOnboarding} />
                <EmailInvitationModal
                    isOpen={isEmailInvitationModalOpen}
                    onClose={() => setIsEmailInvitationModalOpen(false)}
                    onSendInvitation={handleSendInvitation}
                />
                <ManualVendorOnboardingModal
                    isOpen={isManualVendorModalOpen}
                    onClose={() => setIsManualVendorModalOpen(false)}
                />
                <VendorProfileSlidebar
                    isOpen={isVendorProfileSlidebarOpen}
                    onClose={handleCloseVendorProfile}
                    vendorId={selectedVendor?.id}
                    vendorIcon={selectedVendor?.icon}
                />
            </div>
        </AppLayout>
    )
}


// Vendor Card Component
const VendorCard = ({ vendor, onVendorClick }: { vendor: any, onVendorClick: (vendor: any) => void }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showDropdown) {
                setShowDropdown(false)
            }
        }

        if (showDropdown) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [showDropdown])

    return (
        <div
            className="bg-white rounded-2xl relative group transition-all duration-200 border border-gray-100 overflow-visible cursor-pointer hover:shadow-lg"
            onClick={() => onVendorClick(vendor)}
        >
            {/* Purple Patterned Header Section */}
            <div className="relative h-20">
                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        // backgroundImage: `
                        //     linear-gradient(#D6BBFB 1px, transparent 1px),
                        //     linear-gradient(90deg, #D6BBFB 1px, transparent 1px)
                        // `,
                        // backgroundSize: '12px 12px'
                    }}
                />
                <Backgroundsvg />

                {/* Three dots menu */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowDropdown(!showDropdown)
                        }}
                        className="p-1.5 rounded-full bg-white  shadow-sm"
                    >
                        <MoreHorizontal size={14} className="text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div
                            className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-48 max-w-48"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                right: '8px',
                                top: '32px',
                                maxWidth: 'calc(100vw - 32px)'
                            }}
                        >
                            {vendor.options.map((option: string, index: number) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                    onClick={() => {
                                        setShowDropdown(false)
                                        console.log(`${option} clicked for ${vendor.name}`)
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Card Content */}
            <div className="p-4 flex flex-col items-center text-center">
                {/* Central Icon - Overlapping the header */}
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${vendor.backgroundColor}`}
                    >
                        {vendor.icon}
                    </div>
                </div>

                {/* Vendor Name */}
                <h3 className="text-[#344054] font-[400] text-[16px] leading-tight mt-2">
                    {vendor.name ===  null ? vendor.onboarding_email : vendor.name}
                </h3>
            </div>
        </div>

    )
}

export default VendorDirectoryPage