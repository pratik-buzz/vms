'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Menu } from 'lucide-react'
import ApprovalConfirmationModal from './ApprovalConfirmationModal'
import RejectionConfirmationModal from './RejectionConfirmationModal'
import { fetchVendorById, approveVendorStep, rejectVendorStep, finalApproveVendor, reinitiateVendor, rejectVendor } from '../../../common/services/vendorService'

interface DocumentViewerModalProps {
    isOpen: boolean
    onClose: () => void
    vendorId: string
    vendorName: string
    vendorStatus: string
}

interface DocumentStep {
    id: string
    label: string
    completed: boolean
    current: boolean
    status?: 'approved' | 'rejected' | 'pending'
}

interface Document {
    id: string
    name: string
    type: 'image' | 'pdf'
    url: string
    pages?: number
    currentPage?: number
}



const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
    isOpen,
    onClose,
    vendorId,
    vendorName,
    vendorStatus
}) => {
    console.log(vendorStatus, 'vendorStatusvendorStatusvendorStatus')
    const [currentStep, setCurrentStep] = useState(0)
    const [currentDocument, setCurrentDocument] = useState(0)
    const [zoomLevel, setZoomLevel] = useState(100)
    const [vendorDetails, setVendorDetails] = useState<any | null>(null)
    const [stepStatuses, setStepStatuses] = useState<{ [key: string]: 'approved' | 'rejected' | 'pending' }>({})
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [showRejectionModal, setShowRejectionModal] = useState(false)
    const [showReinitiateModal, setShowReinitiateModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset all data when modal closes
    const resetModalData = () => {
        setCurrentStep(0)
        setCurrentDocument(0)
        setZoomLevel(100)
        setStepStatuses({})
        setVendorDetails(null)
        setIsSidebarOpen(false)
        setShowApprovalModal(false)
        setShowRejectionModal(false)
        setShowReinitiateModal(false)
        setLoading(false)
        setError(null)
    }

    // Fetch vendor details from API
    const fetchVendorData = async () => {
        if (!vendorId) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetchVendorById(vendorId)
            if (response.code === 200) {
                setVendorDetails(response.data)

                // Map approval steps to step statuses (handle null approval_steps)
                const statusMap: { [key: string]: 'approved' | 'rejected' | 'pending' } = {}
                if (response.data.approval_steps && Array.isArray(response.data.approval_steps)) {
                    response.data.approval_steps.forEach((step: any) => {
                        // Map API step names to our step IDs
                        let stepId = ''
                        switch (step.step) {
                            case 'BASIC_DETAILS':
                                stepId = 'basic'
                                break
                            case 'CONTRACT_DETAILS':
                                stepId = 'pf'
                                break
                            case 'BILLING_DETAILS':
                                stepId = 'esic'
                                break
                            case 'OTHER_DETAILS':
                                stepId = 'other'
                                break
                            default:
                                stepId = step.step.toLowerCase()
                        }
                        statusMap[stepId] = step.isApproved ? 'approved' : 'rejected'
                    })
                }
                setStepStatuses(statusMap)
            } else {
                setError('Failed to fetch vendor details')
            }
        } catch (err) {
            console.error('Error fetching vendor details:', err)
            setError('Failed to fetch vendor details')
        } finally {
            setLoading(false)
        }
    }

    // Document steps navigation - dynamic based on currentStep
    const steps: DocumentStep[] = [
        { id: 'basic', label: 'Basic details', completed: false, current: currentStep === 0, status: 'pending' },
        { id: 'pf', label: 'Contract details', completed: false, current: currentStep === 1, status: 'pending' },
        { id: 'esic', label: 'Billing details', completed: false, current: currentStep === 2, status: 'pending' },
        { id: 'other', label: 'Other details', completed: false, current: currentStep === 3, status: 'pending' },
        // { id: 'pan', label: 'PAN details', completed: false, current: currentStep === 4, status: 'pending' },
        // { id: 'bank', label: 'Bank details', completed: false, current: currentStep === 5, status: 'pending' }
    ]

    // Sample documents - in real implementation, these would come from API
    const documents: Document[] = [
        {
            id: '1',
            name: 'PAN Card',
            type: 'image',
            url: '/api/placeholder/400/250', // Placeholder for PAN card image
            pages: 2,
            currentPage: 1
        },
        {
            id: '2',
            name: 'Aadhaar Card',
            type: 'image',
            url: '/api/placeholder/400/250', // Placeholder for Aadhaar card image
            pages: 1,
            currentPage: 1
        }
    ]

    // Fetch vendor data when modal opens
    useEffect(() => {
        if (isOpen && vendorId) {
            fetchVendorData()
        }
    }, [isOpen, vendorId])

    const handleStepClick = (stepIndex: number) => {
        setCurrentStep(stepIndex)
        // Reset document to first document when changing steps
        setCurrentDocument(0)
        // Force re-render to update step colors
        setStepStatuses(prev => ({ ...prev }))
        // Close mobile sidebar when step is selected
        setIsSidebarOpen(false)
    }

    const handlePreviousTask = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            setCurrentDocument(0)
        }
    }

    const handleNextTask = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
            setCurrentDocument(0)
        }
    }

    const handlePreviousDocument = () => {
        if (currentDocument > 0) {
            setCurrentDocument(currentDocument - 1)
        }
    }

    const handleNextDocument = () => {
        if (currentDocument < documents.length - 1) {
            setCurrentDocument(currentDocument + 1)
        }
    }

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 25, 200))
    }

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 25, 50))
    }

    const handleApprove = () => {
        setShowApprovalModal(true)
    }

    const handleConfirmApproval = async () => {
        try {
            setLoading(true)

            // Map step ID to API step name
            const stepMapping: { [key: string]: string } = {
                'basic': 'BASIC_DETAILS',
                'pf': 'CONTRACT_DETAILS',
                'esic': 'BILLING_DETAILS',
                'other': 'OTHER_DETAILS',
            }

            const apiStepName = stepMapping[steps[currentStep].id]
            if (!apiStepName) {
                console.error('Unknown step ID:', steps[currentStep].id)
                return
            }

            // Call API to approve the step
            const response = await approveVendorStep(vendorId, apiStepName)

            if (response.code === 200) {
                // Update current step status to approved
                const currentStepId = steps[currentStep].id
                setStepStatuses(prev => ({
                    ...prev,
                    [currentStepId]: 'approved'
                }))

                // Close approval modal
                setShowApprovalModal(false)

                // Automatically move to next step if available
                if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1)
                    setCurrentDocument(0)
                }
                // Note: Don't auto-close modal on last step - let user decide with final buttons
            } else {
                console.error('Failed to approve step:', response.message)
                setError('Failed to approve step')
            }
        } catch (err) {
            console.error('Error approving step:', err)
            setError('Failed to approve step')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelApproval = () => {
        setShowApprovalModal(false)
    }

    const handleReject = () => {
        setShowRejectionModal(true)
    }

    const handleConfirmRejection = async () => {
        try {
            setLoading(true)

            // Map step ID to API step name
            const stepMapping: { [key: string]: string } = {
                'basic': 'BASIC_DETAILS',
                'pf': 'CONTRACT_DETAILS',
                'esic': 'BILLING_DETAILS',
                'other': 'OTHER_DETAILS'
            }

            const apiStepName = stepMapping[steps[currentStep].id]
            if (!apiStepName) {
                console.error('Unknown step ID:', steps[currentStep].id)
                return
            }

            // Call API to reject the step
            const response = await rejectVendorStep(vendorId, apiStepName)

            if (response.code === 200) {
                // Update current step status to rejected
                const currentStepId = steps[currentStep].id
                setStepStatuses(prev => ({
                    ...prev,
                    [currentStepId]: 'rejected'
                }))

                // Close rejection modal
                setShowRejectionModal(false)

                // Automatically move to next step if available
                if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1)
                    setCurrentDocument(0)
                }
                // Note: Don't auto-close modal on last step - let user decide with final buttons
            } else {
                console.error('Failed to reject step:', response.message)
                setError('Failed to reject step')
            }
        } catch (err) {
            console.error('Error rejecting step:', err)
            setError('Failed to reject step')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelRejection = () => {
        setShowRejectionModal(false)
    }

    const handleClose = () => {
        resetModalData()
        onClose()
    }

    // Final step button handlers
    const handleApproveCompletely = () => {
        setShowApprovalModal(true)
    }

    const handleFinalApproval = async () => {
        try {
            setLoading(true)

            // Call API to final approve the vendor
            const response = await finalApproveVendor(vendorId)

            if (response.code === 200) {
                // Close modal and reset data
                resetModalData()
                onClose()
                console.log('Vendor approved completely')
            } else {
                console.error('Failed to final approve vendor:', response.message)
                setError('Failed to approve vendor completely')
            }
        } catch (err) {
            console.error('Error final approving vendor:', err)
            setError('Failed to approve vendor completely')
        } finally {
            setLoading(false)
        }
    }

    const handleRejectCompletely = () => {
        setShowRejectionModal(true)
    }

    const handleRejectAndReinitiate = () => {
        setShowReinitiateModal(true)
    }

    const handleConfirmRejectCompletely = async (reason?: string) => {
        try {
            setLoading(true)

            // Call API to reject vendor completely
            const response = await rejectVendor(vendorId, reason || 'Vendor rejected completely')

            if (response.code === 200) {
                // Close modal and reset data
                resetModalData()
                onClose()
                console.log('Vendor rejected completely')
            } else {
                console.error('Failed to reject vendor:', response.message)
                setError('Failed to reject vendor completely')
            }
        } catch (err) {
            console.error('Error rejecting vendor:', err)
            setError('Failed to reject vendor completely')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmReinitiate = async (reason?: string) => {
        try {
            setLoading(true)

            // Call API to reinitiate vendor
            const response = await reinitiateVendor(vendorId, reason || 'Vendor reinitiated')

            if (response.code === 200) {
                // Close modal and reset data
                resetModalData()
                onClose()
                console.log('Vendor reinitiated')
            } else {
                console.error('Failed to reinitiate vendor:', response.message)
                setError('Failed to reinitiate vendor')
            }
        } catch (err) {
            console.error('Error reinitiating vendor:', err)
            setError('Failed to reinitiate vendor')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const currentDoc = documents[currentDocument]
    const completedSteps = 2 // Show 2/3 tasks as in the image
    const totalSteps = 3

    // Get current step info
    const currentStepInfo = steps[currentStep]

    // Show loading state
    if (loading) {
        return (
            <>
                <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-[1000] transition-opacity duration-300" />
                <div className="fixed overflow-y-auto right-0 top-0 h-full w-full max-w-7xl bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden translate-x-0">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading vendor details...</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Show error state
    if (error) {
        return (
            <>
                <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-[1000] transition-opacity duration-300" />
                <div className="fixed overflow-y-auto right-0 top-0 h-full w-full max-w-7xl bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden translate-x-0">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-red-500 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setError(null)
                                        fetchVendorData()
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Different content sections for each step
    const getStepContent = () => {
        if (!vendorDetails) {
            return {
                title: 'Loading...',
                documents: [],
                details: {
                    title: 'Loading...',
                    fields: []
                }
            }
        }

        switch (currentStepInfo.id) {
            case 'basic':
                return {
                    title: "Vendor's Basic Info",
                    documents: [],
                    details: {
                        title: 'Basic Information',
                        fields: [
                            { label: 'Vendor full name', value: vendorDetails.full_name || 'N/A' },
                            { label: 'Vendor short name', value: vendorDetails.short_name || 'N/A' },
                            { label: 'GSTIN', value: vendorDetails.gst?.gstin || 'N/A' }
                        ]
                    },
                    address: vendorDetails.addresses?.[0] ? {
                        label: 'Head office',
                        value: `${vendorDetails.addresses[0].address_line1}${vendorDetails.addresses[0].address_line2 ? ', ' + vendorDetails.addresses[0].address_line2 : ''}`
                    } : null,
                    contract: {
                        startDate: vendorDetails.contract?.contract_start_date ? new Date(vendorDetails.contract.contract_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
                        endDate: vendorDetails.contract?.contract_end_date ? new Date(vendorDetails.contract.contract_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
                        tenure: vendorDetails.contract?.contract_start_date && vendorDetails.contract?.contract_end_date ?
                            Math.ceil((new Date(vendorDetails.contract.contract_end_date).getTime() - new Date(vendorDetails.contract.contract_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' months' : 'N/A',
                        attachments: vendorDetails.contract?.contract_file_url ? 1 : 0
                    },
                    poc: vendorDetails.pocs?.[0] ? {
                        name: vendorDetails.pocs[0].name,
                        email: vendorDetails.pocs[0].email,
                        phone: vendorDetails.pocs[0].phone
                    } : null,
                    billing: {
                        gstin: vendorDetails.gst?.gstin || 'N/A',
                        gstTreatment: vendorDetails.gst?.gst_treatment || 'N/A',
                        msme: vendorDetails.msme?.msme_type || 'N/A',
                        gstinAttachments: vendorDetails.gst?.gst_certificate_file_id ? 1 : 0
                    }
                }
            case 'pf':
                return {
                    title: 'Contract Details',
                    documents: [
                        ...(vendorDetails.contract?.contract_file_url ? [{
                            id: '1',
                            name: 'Contract Document',
                            type: vendorDetails.contract.contract_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.contract.contract_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : []),
                        ...(vendorDetails.pf?.pf_certificate_file_url ? [{
                            id: '2',
                            name: 'PF Certificate',
                            type: vendorDetails.pf.pf_certificate_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.pf.pf_certificate_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : [])
                    ],
                    details: {
                        title: 'Contract Details',
                        fields: [
                            { label: 'Contract Start Date', value: vendorDetails.contract?.contract_start_date ? new Date(vendorDetails.contract.contract_start_date).toLocaleDateString() : 'N/A' },
                            { label: 'Contract End Date', value: vendorDetails.contract?.contract_end_date ? new Date(vendorDetails.contract.contract_end_date).toLocaleDateString() : 'N/A' },
                            { label: 'Margin Percent', value: vendorDetails.contract?.margin_percent ? `${vendorDetails.contract.margin_percent}%` : 'N/A' },
                            { label: 'PF Number', value: vendorDetails.pf?.establishment_pf_number || 'N/A' }
                        ]
                    }
                }
            case 'esic':
                return {
                    title: 'Billing Details',
                    documents: [
                        ...(vendorDetails.esic?.esic_certificate_file_url ? [{
                            id: '1',
                            name: 'ESIC Certificate',
                            type: vendorDetails.esic.esic_certificate_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.esic.esic_certificate_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : []),
                        ...(vendorDetails.gst?.gst_certificate_file_id ? [{
                            id: '2',
                            name: 'GST Certificate',
                            type: 'image' as const,
                            url: '/api/placeholder/400/250', // Placeholder since GST certificate URL not in API
                            pages: 1,
                            currentPage: 1
                        }] : [])
                    ],
                    details: {
                        title: 'Billing Details',
                        fields: [
                            { label: 'ESIC ID', value: vendorDetails.esic?.esic_id || 'N/A' },
                            { label: 'Branch', value: vendorDetails.esic?.branch || 'N/A' },
                            { label: 'GST Number', value: vendorDetails.gst?.gstin || 'N/A' },
                            { label: 'GST Treatment', value: vendorDetails.gst?.gst_treatment || 'N/A' }
                        ]
                    }
                }
            case 'other':
                return {
                    title: 'Other Details',
                    documents: [
                        ...(vendorDetails.pt?.pt_certificate_file_url ? [{
                            id: '1',
                            name: 'PT Certificate',
                            type: vendorDetails.pt.pt_certificate_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.pt.pt_certificate_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : []),
                        ...(vendorDetails.lwf?.lwf_certificate_file_url ? [{
                            id: '2',
                            name: 'LWF Certificate',
                            type: vendorDetails.lwf.lwf_certificate_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.lwf.lwf_certificate_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : []),
                        ...(vendorDetails.bankAccount?.cancelled_cheque_file_url ? [{
                            id: '3',
                            name: 'Cancelled Cheque',
                            type: vendorDetails.bankAccount.cancelled_cheque_file_url.filename.toLowerCase().endsWith('.pdf') ? 'pdf' as const : 'image' as const,
                            url: vendorDetails.bankAccount.cancelled_cheque_file_url.presignedUrl,
                            pages: 1,
                            currentPage: 1
                        }] : [])
                    ],
                    details: {
                        title: 'Other Details',
                        fields: [
                            { label: 'PT ID', value: vendorDetails.pt?.pt_id || 'N/A' },
                            { label: 'PT State', value: vendorDetails.pt?.pt_state || 'N/A' },
                            { label: 'LWF ID', value: vendorDetails.lwf?.lwf_id || 'N/A' },
                            { label: 'LWF State', value: vendorDetails.lwf?.lwf_state || 'N/A' },
                            { label: 'Bank Account', value: vendorDetails.bankAccount?.account_number || 'N/A' },
                            { label: 'IFSC Code', value: vendorDetails.bankAccount?.ifsc || 'N/A' }
                        ]
                    }
                }
            // case 'pan':
            //     return {
            //         title: 'PAN Details',
            //         documents: [
            //             { id: '1', name: 'PAN Card', type: 'image' as const, url: '/api/placeholder/400/250', pages: 2, currentPage: 1 },
            //             { id: '2', name: 'Aadhaar Card', type: 'image' as const, url: '/api/placeholder/400/250', pages: 1, currentPage: 1 }
            //         ],
            //         details: {
            //             title: 'PAN Details',
            //             fields: [
            //                 { label: 'PAN ID', value: 'FRMPS232DS' },
            //                 { label: 'Name', value: 'Olivia Rhye' },
            //                 { label: 'Date of Birth', value: '23 April 2024' },
            //                 { label: "Father's Name", value: 'Hero Rhye' }
            //             ]
            //         }
            //     }
            // case 'bank':
            //     return {
            //         title: 'Bank Details',
            //         documents: [
            //             { id: '1', name: 'Bank Statement', type: 'image' as const, url: '/api/placeholder/400/250', pages: 3, currentPage: 1 },
            //             { id: '2', name: 'Cancelled Cheque', type: 'image' as const, url: '/api/placeholder/400/250', pages: 1, currentPage: 1 }
            //         ],
            //         details: {
            //             title: 'Bank Details',
            //             fields: [
            //                 { label: 'Account Number', value: '1234567890' },
            //                 { label: 'Bank Name', value: 'State Bank of India' },
            //                 { label: 'IFSC Code', value: 'SBIN0001234' },
            //                 { label: 'Branch', value: 'Main Branch' }
            //             ]
            //         }
            //     }
            default:
                return {
                    title: 'Document Viewer',
                    documents: [],
                    details: {
                        title: 'Vendor Details',
                        fields: [
                            { label: 'Full Name', value: vendorDetails.full_name },
                            { label: 'Short Name', value: vendorDetails.short_name },
                            { label: 'PAN', value: vendorDetails.pan },
                            { label: 'TAN', value: vendorDetails.tan }
                        ]
                    }
                }
        }
    }

    const stepContent = getStepContent()

    // Check if all steps are actioned (approved or rejected)
    const allStepsActioned = steps.every(step =>
        stepStatuses[step.id] === 'approved' || stepStatuses[step.id] === 'rejected'
    )

    // Check if any step is rejected
    const hasRejectedSteps = steps.some(step => stepStatuses[step.id] === 'rejected')

    // Check if we're on the last step and all steps are actioned
    const showFinalButtons = currentStep === steps.length - 1 && allStepsActioned

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 z-[1000] transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Slidebar */}
            <div className={`fixed overflow-y-auto right-0 top-0 h-full w-full max-w-7xl bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="bg-[#7F56D9] px-4 lg:px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden text-white hover:text-gray-200 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-white text-lg font-semibold">Documents</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}


                {/* Main Content - Fixed Layout */}
                <div className="flex-1 flex relative">
                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Left Sidebar - Steps Navigation */}
                    <div className={`lg:w-[15rem] bg-gray-50 border-r border-gray-200 p-4 lg:p-6 flex-shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block overflow-y-auto ${isSidebarOpen
                        ? 'fixed left-0 top-0 h-full w-72 z-20 translate-x-0'
                        : 'fixed left-0 top-0 h-full w-72 z-20 -translate-x-full lg:translate-x-0'
                        }`}>
                        <div className="space-y-1">
                            {steps.map((step, index) => (
                                <div key={step.id} className="relative">
                                    {/* Connecting line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[25px] top-[46px] w-0.5 h-4 bg-gray-300 z-0"></div>
                                    )}

                                    <button
                                        onClick={() => handleStepClick(index)}
                                        className={`w-full text-left p-[10px] rounded-lg transition-all duration-200 relative z-10 `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                {/* Step circle */}
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${step.current
                                                        ? 'bg-purple'
                                                        : stepStatuses[step.id] === 'approved'
                                                            ? 'bg-green-600'
                                                            : stepStatuses[step.id] === 'rejected'
                                                                ? 'bg-red-600'
                                                                : 'bg-white border-2 border-gray-300'
                                                        }`}
                                                >
                                                    {stepStatuses[step.id] === 'approved' ? (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : stepStatuses[step.id] === 'rejected' ? (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : step.current ? (
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`text-[14px] font-[600] transition-colors duration-200 ${step.current
                                                ? 'text-purple'
                                                : stepStatuses[step.id] === 'approved'
                                                    ? 'text-green-600'
                                                    : stepStatuses[step.id] === 'rejected'
                                                        ? 'text-red-600'
                                                        : 'text-[#344054]'
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col  w-full h-full">
                        <div className="flex flex-col sm:flex-row justify-end items-center p-4 border-b border-gray-200 flex-shrink-0 gap-2 sm:gap-0">
                            {/* <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {completedSteps}/{totalSteps} tasks
                        </span>
                    </div> */}
                            <div className="flex flex-row gap-2">
                                <button
                                    onClick={handlePreviousTask}
                                    disabled={currentStep === 0}
                                    className="px-3 py-1 text-sm text-purple hover:text-purple disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="hidden sm:inline">&lt; Previous task</span>
                                    <span className="sm:hidden">&lt; Prev</span>
                                </button>
                                <button
                                    onClick={handleNextTask}
                                    disabled={currentStep === steps.length - 1}
                                    className="px-3 py-1 text-sm text-purple hover:text-purple disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="hidden sm:inline">Next Task &gt;</span>
                                    <span className="sm:hidden">Next &gt;</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex w-full h-full flex-col lg:flex-row">
                            {/* Document Viewer - Hidden for Basic Info step */}
                            {currentStepInfo.id !== 'basic' && (
                                <div className="flex-1 p-4 lg:p-8 w-full flex flex-col ">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        {/* Step Title */}
                                        <div className="mb-6 flex-shrink-0">
                                            <h3 className="text-xl font-semibold text-gray-900">{stepContent.title}</h3>
                                            {stepContent.documents.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">
                                                        {stepContent.documents.length} document{stepContent.documents.length > 1 ? 's' : ''} available
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {stepContent.documents.map((doc, index) => (
                                                            <button
                                                                key={doc.id}
                                                                onClick={() => setCurrentDocument(index)}
                                                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${currentDocument === index
                                                                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                                                                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {doc.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Zoom Controls */}
                                        {/* <div className="flex items-center justify-center mb-6 flex-shrink-0">
                                            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2">
                                                <button
                                                    onClick={handleZoomOut}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <ZoomOut size={16} />
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-full bg-purple-600 rounded-full"
                                                            style={{ width: `${(zoomLevel - 50) / 1.5}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 font-medium">{zoomLevel}%</span>
                                                </div>
                                                <button
                                                    onClick={handleZoomIn}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <ZoomIn size={16} />
                                                </button>
                                            </div>
                                        </div> */}

                                        {/* Document Display - Only this section scrolls */}
                                        <div className="flex-1 bg-gray-50 rounded-lg relative border border-gray-200 overflow-auto p-4 w-full h-full">
                                            {stepContent.documents.length === 0 ? (
                                                <div className="w-full h-full flex items-center justify-center min-h-full">
                                                    <div className="text-center">
                                                        <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                                                        <p className="text-gray-600">No documents available for this step</p>
                                                    </div>
                                                </div>
                                            ) : stepContent.documents[currentDocument]?.type === 'image' ? (
                                                <div className="relative w-full h-full max-h-[500px] min-h-[300px] flex items-center justify-center ">
                                                    <img
                                                        src={stepContent.documents[currentDocument].url}
                                                        alt={stepContent.documents[currentDocument].name}
                                                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                                        style={{ transform: `scale(${zoomLevel / 100})` }}
                                                        onError={(e) => {
                                                            // If image fails to load, show PDF viewer
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `
                                                                    <div class="w-full h-full flex items-center justify-center min-h-full">
                                                                        <div class="text-center">
                                                                            <iframe 
                                                                                src="${stepContent.documents[currentDocument].url}" 
                                                                                className="w-full h-full min-h-[500px] border-0 rounded-lg"
                                                                                title="${stepContent.documents[currentDocument].name}"
                                                                            ></iframe>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            }
                                                        }}
                                                    />
                                                    {/* Navigation arrows on document */}
                                                    <button
                                                        onClick={handlePreviousDocument}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg border border-gray-200"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        onClick={handleNextDocument}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg border border-gray-200"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>

                                                    {/* Annotation markers */}
                                                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        S
                                                    </div>
                                                    <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        S
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center min-h-full">
                                                    <iframe
                                                        src={stepContent.documents[currentDocument]?.url || ''}
                                                        className="w-full h-full min-h-[500px] border-0 rounded-lg"
                                                        title={stepContent.documents[currentDocument]?.name || 'Document'}
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>

                                        {/* Document Navigation */}
                                        {stepContent.documents.length > 0 && (
                                            <div className="flex items-center justify-center mt-6 gap-6 flex-shrink-0">
                                                <button
                                                    onClick={handlePreviousDocument}
                                                    disabled={currentDocument === 0}
                                                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <div className="text-center">
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        {stepContent.documents[currentDocument]?.currentPage || 1}/{stepContent.documents[currentDocument]?.pages || 1}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Document {currentDocument + 1} of {stepContent.documents.length}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleNextDocument}
                                                    disabled={currentDocument === stepContent.documents.length - 1}
                                                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Basic Info Layout - Full width for basic step */}
                            {currentStepInfo.id === 'basic' && (
                                <div className="flex-1 p-4 lg:p-8 w-full">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">{stepContent.title}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Primary Details Card */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Primary details</h4>
                                            <div className="space-y-3">
                                                {stepContent.details.fields.map((field, index) => (
                                                    <div key={index}>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">{field.label}</div>
                                                        <div className="text-sm font-semibold text-gray-900">{field.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Address Card */}
                                        {stepContent.address && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Address</h4>
                                                <div>
                                                    <div className="text-xs text-gray-500 font-medium mb-1">{stepContent.address.label}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{stepContent.address.value}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contract Details Card */}
                                        {stepContent.contract && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900">Contract details</h4>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500 font-medium">Accepted contract</span>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs text-gray-700">{stepContent.contract.attachments} attachment</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Contract start date</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.contract.startDate}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Contract end date</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.contract.endDate}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Tenure</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.contract.tenure}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Vendor POC Card */}
                                        {stepContent.poc && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Vendor POC</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">POC Name</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.poc.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Email</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.poc.email}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Phone</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.poc.phone}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Billing & Invoicing Card */}
                                        {stepContent.billing && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Billing & Invoicing</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500 font-medium">GSTIN Document</span>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs text-gray-700">{stepContent.billing.gstinAttachments} attachment</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">GSTIN</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.billing.gstin}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">Type of GST treatment</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.billing.gstTreatment}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium mb-1">MSME</div>
                                                        <div className="text-sm font-semibold text-gray-900">{stepContent.billing.msme}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Right Sidebar - Step Details - Hidden for Basic Info step */}
                            {currentStepInfo.id !== 'basic' && (
                                <div className="w-full lg:w-96 bg-white border-l border-gray-200 p-6 flex-shrink-0">
                                    {/* Personal Details - Two Column Layout with Dynamic Data */}
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        {/* Left Column - First half of fields */}
                                        <div className="space-y-4">
                                            {stepContent.details.fields.slice(0, Math.ceil(stepContent.details.fields.length / 2)).map((field, index) => (
                                                <div key={index}>
                                                    <div className="text-xs text-gray-500 font-medium mb-1">{field.label}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{field.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Column - Second half of fields */}
                                        <div className="space-y-4">
                                            {stepContent.details.fields.slice(Math.ceil(stepContent.details.fields.length / 2)).map((field, index) => (
                                                <div key={index}>
                                                    <div className="text-xs text-gray-500 font-medium mb-1">{field.label}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{field.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dashed Divider */}
                                    <div className="border-t border-dashed border-gray-300 mb-6"></div>

                                    {/* Attachments Section - Dynamic Count */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 0.75H24C24.1212 0.75 24.2375 0.798088 24.3232 0.883789L35.1162 11.6768C35.2019 11.7625 35.25 11.8788 35.25 12V36C35.25 37.7949 33.7949 39.25 32 39.25H8C6.20507 39.25 4.75 37.7949 4.75 36V4C4.75 2.20507 6.20508 0.75 8 0.75Z" fill="white" stroke="#D0D5DD" strokeWidth="1.5" />
                                                <path d="M24 0.5V8C24 10.2091 25.7909 12 28 12H35.5" stroke="#D0D5DD" strokeWidth="1.5" />
                                                <path d="M25.7088 25.3438C24.586 25.3438 23.1808 25.5396 22.7211 25.6085C20.8184 23.6216 20.277 22.4922 20.1553 22.191C20.3203 21.7671 20.8944 20.1564 20.976 18.0878C21.0162 17.0521 20.7975 16.2782 20.3256 15.7876C19.8545 15.2979 19.2843 15.2598 19.1208 15.2598C18.5475 15.2598 17.5857 15.5497 17.5857 17.4911C17.5857 19.1756 18.3711 20.9631 18.5882 21.4249C17.4443 24.7554 16.2163 27.0353 15.9556 27.5042C11.3594 29.2347 11 30.9079 11 31.3821C11 32.2342 11.6069 32.743 12.6234 32.743C15.0932 32.743 17.347 28.5965 17.7197 27.8765C19.4738 27.1776 21.8216 26.7446 22.4184 26.6413C24.1304 28.2721 26.1104 28.7073 26.9326 28.7073C27.5512 28.7073 28.9999 28.7073 28.9999 27.2177C29 25.8345 27.2271 25.3438 25.7088 25.3438ZM25.5898 26.3216C26.9238 26.3216 27.2764 26.7628 27.2764 26.9961C27.2764 27.1424 27.2208 27.62 26.5058 27.62C25.8646 27.62 24.7575 27.2494 23.6683 26.4454C24.1225 26.3857 24.7947 26.3216 25.5898 26.3216ZM19.0508 16.2076C19.1724 16.2076 19.2525 16.2467 19.3185 16.3383C19.7022 16.8706 19.3928 18.6103 19.0163 19.9716C18.6528 18.8043 18.38 17.0133 18.7638 16.3831C18.8388 16.2602 18.9246 16.2076 19.0508 16.2076ZM18.4029 26.6275C18.8859 25.6517 19.4272 24.2297 19.722 23.4255C20.3121 24.4131 21.1057 25.3301 21.5647 25.8272C20.1356 26.1285 19.0543 26.4295 18.4029 26.6275ZM11.9594 31.5123C11.9276 31.4745 11.9229 31.395 11.9469 31.2994C11.9971 31.0993 12.3814 30.1072 15.1608 28.8639C14.7628 29.4907 14.1407 30.3864 13.4572 31.0556C12.9761 31.5059 12.6014 31.7343 12.3437 31.7343C12.2515 31.7343 12.1244 31.7092 11.9594 31.5123Z" fill="#D92D20" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">
                                            {stepContent.documents.length} attachments added.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Action Buttons */}
                {vendorStatus === 'PENDING' && (
                <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    {showFinalButtons ? (
                        // Final step buttons - show 3 buttons when all steps are actioned
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={handleRejectAndReinitiate}
                                disabled={!hasRejectedSteps}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
                            >
                                Reject & Re-Initiate
                            </button>
                            <button
                                onClick={handleRejectCompletely}
                                disabled={!hasRejectedSteps}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
                            >
                                Reject Completely
                            </button>
                            <button
                                onClick={handleApproveCompletely}
                                disabled={hasRejectedSteps}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-[#7F56D9] border border-[#7F56D9] rounded-lg hover:bg-[#6B46C1] hover:border-[#6B46C1] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400 transition-all duration-200"
                            >
                                Approve Completely
                            </button>
                        </div>
                    ) : (
                        // Regular step buttons - show approve/reject for current step
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={handleReject}
                                disabled={stepStatuses[steps[currentStep].id] === 'rejected'}
                                className={`w-full sm:w-[100px] h-[40px] px-4 text-sm font-medium rounded-lg transition-colors ${stepStatuses[steps[currentStep].id] === 'rejected'
                                    ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {stepStatuses[steps[currentStep].id] === 'rejected' ? 'Rejected' : 'Reject'}
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={stepStatuses[steps[currentStep].id] === 'approved'}
                                className={`w-full sm:w-[100px] h-[40px] px-4 text-sm font-medium rounded-lg transition-colors ${stepStatuses[steps[currentStep].id] === 'approved'
                                    ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                                    : 'text-white bg-[#7F56D9] hover:bg-[#6B46C1]'
                                    }`}
                            >
                                {stepStatuses[steps[currentStep].id] === 'approved' ? 'Approved' : 'Approve'}
                            </button>
                        </div>
                    )}
                </div>
                )} 
            </div>

            {/* Approval Confirmation Modal */}
            <ApprovalConfirmationModal
                isOpen={showApprovalModal}
                onClose={handleCancelApproval}
                onConfirm={showFinalButtons ? handleFinalApproval : handleConfirmApproval}
                title={showFinalButtons ? "Final Approval" : "Approve request"}
                message={showFinalButtons ? "Are you sure you want to approve this vendor completely?" : "Are you sure you want to approve this request?"}
            />

            {/* Rejection Confirmation Modal */}
            <RejectionConfirmationModal
                isOpen={showRejectionModal}
                onClose={handleCancelRejection}
                onConfirm={showFinalButtons ? handleConfirmRejectCompletely : handleConfirmRejection}
                title={showFinalButtons ? "Reject Completely" : "Reject request"}
                message={showFinalButtons ? "Are you sure you want to reject this vendor completely?" : "Are you sure you want to reject this request?"}
                requireReason={showFinalButtons}
            />

            <RejectionConfirmationModal
                isOpen={showReinitiateModal}
                onClose={() => setShowReinitiateModal(false)}
                onConfirm={handleConfirmReinitiate}
                title="Re-initiate"
                message="Do you want to reinitiate this request?"
                requireReason={true}
            />
        </>
    )
}

export default DocumentViewerModal
