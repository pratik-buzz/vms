import { Get, Post, Put } from '../axios/api'
import { API_GET, API_PUT } from '../constant/api'

export interface Vendor {
    id: string
    vendor_id: number
    tenant_id: string
    full_name: string | null
    short_name: string | null
    pan: string | null
    tan: string | null
    metadata: Record<string, any>
    is_active: boolean
    exited: boolean
    exited_at: string | null
    terminated: boolean
    terminated_at: string | null
    onboarding_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
    onboarding_invitation_token: string | null
    onboarding_invitation_sent_at: string | null
    onboarding_invitation_expires_at: string | null
    onboarding_invited_by: string | null
    onboarded_by_admin: boolean | null
    created_by: string
    updated_by: string | null
    created_at: string
    onboarding_email: string | null
    updated_at: string
    deleted_at: string | null
}

export interface VendorsResponse {
    count: number
    rows: Vendor[]
}

export interface VendorsApiResponse {
    code: number
    message: string
    data: VendorsResponse
}

export const fetchVendors = async (
    page: number = 1,
    pageSize: number = 10,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    dateFrom?: string,
    dateTo?: string
): Promise<VendorsApiResponse> => {
    const params: any = {
        page,
        pageSize,
        sortOrder
    }

    // Add date filters if provided
    if (dateFrom) {
        params.dateFrom = dateFrom
    }
    if (dateTo) {
        params.dateTo = dateTo
    }

    const response = await Get<VendorsApiResponse>(API_GET.VENDORS, params)
    return response.data
}

export const fetchVendorsPage = async (
    page: number = 1,
    pageSize: number = 10,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    dateFrom?: string,
    dateTo?: string
): Promise<{ vendors: Vendor[], hasMore: boolean, totalCount: number }> => {
    const response = await fetchVendors(page, pageSize, sortOrder, dateFrom, dateTo)
    return {
        vendors: response.data.rows,
        hasMore: response.data.rows.length === pageSize,
        totalCount: response.data.count
    }
}

export const approveVendor = async (vendorId: string): Promise<any> => {
    const url = API_PUT.VENDOR_APPROVE.replace(':id', vendorId)
    const response = await Put<any>(url, {})
    return response.data
}

export const rejectVendor = async (vendorId: string, reason: string): Promise<any> => {
    const url = API_PUT.VENDOR_REINITIATE.replace(':id', vendorId)
    const response = await Put<any>(url, {
        reason,
        type: 'VENDOR_REJECT'
    })
    return response.data
}

export const resendInvitation = async (vendorId: string, email: string, subject: string, content: string): Promise<any> => {
    const url = API_PUT.VENDOR_RESEND_INVITATION.replace(':id', vendorId)
    const response = await Post<any>(url, { email, subject, content })
    return response.data
}

export const fetchVendorById = async (vendorId: string): Promise<any> => {
    const url = API_GET.VENDOR_BY_ID.replace(':id', vendorId)
    const response = await Get<any>(url)
    return response.data
}

export const approveVendorStep = async (vendorId: string, step: string): Promise<any> => {
    const url = API_PUT.VENDOR_APPROVE_STEP.replace(':id', vendorId).replace(':step', step)
    const response = await Put<any>(url, {})
    return response.data
}

export const rejectVendorStep = async (vendorId: string, step: string): Promise<any> => {
    const url = API_PUT.VENDOR_REJECT_STEP.replace(':id', vendorId).replace(':step', step)
    const response = await Put<any>(url, {})
    return response.data
}

export const finalApproveVendor = async (vendorId: string): Promise<any> => {
    const url = API_PUT.VENDOR_FINAL_APPROVE.replace(':id', vendorId)
    const response = await Put<any>(url, {})
    return response.data
}

export const reinitiateVendor = async (vendorId: string, reason: string): Promise<any> => {
    const url = API_PUT.VENDOR_REINITIATE.replace(':id', vendorId)
    const response = await Put<any>(url, {
        reason,
        type: 'VENDOR_INITIATE_REJECT'
    })
    return response.data
}