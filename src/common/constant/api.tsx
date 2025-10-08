export const API_GET = {
    ORGANIZATIONS_DROPDOWN: '/organizations/dropdown',
    ORGANIZATIONS_BY_SERVICE: '/org/client/by-organization-service',
    ORGANIZATIONS_COUNTS: '/organizations/counts',
    ORGANIZATIONS: '/organizations',
    VENDORS: '/vendors',
    VENDOR_BY_ID: '/vendors/:id',
    VENDORS_STATUS_COUNTS: '/vendors/status-counts',
    COUNTRIES: '/countries',
    STATES: '/states',
    CITIES: '/cities',
};

export const API_POST = {
    TEST: '/',
    CREATE_ORGANIZATION: '/client',
    REQUEST_NEW_ORGANIZATION: '/organizations/request-new-organization',
    CLIENT_AGREEMENT: '/client/agreement',
    ORGANIZATIONS_LOGO: '/organizations/logo',
    VENDORS_ONBOARDING_SEND_INVITATION: '/vendors/onboarding/send-invitation',
    VENDORS_ONBOARDING_DETAILS: '/vendors/onboarding/details',
    VENDORS_ONBOARDING_CONTRACT_DETAILS: '/vendors/onboarding/contract-details',
    VENDORS_ONBOARDING_BILLING_INVOICE_DETAILS: '/vendors/onboarding/billing-invoice-details',
    VENDORS_ONBOARDING_OTHER_DETAILS: '/vendors/onboarding/other-details',
    VENDORS_ONBOARDING_UPLOAD_CONTRACT_DOCUMENT: '/vendors/vendor-files/upload-contract-document',
    VENDORS_UPLOAD_PF_CERTIFICATE: '/vendors/vendor-files/upload-pf-certificate',
    VENDORS_UPLOAD_ESIC_CERTIFICATE: '/vendors/vendor-files/upload-esic-certificate',
    VENDORS_UPLOAD_PT_CERTIFICATE: '/vendors/vendor-files/upload-pt-certificate',
    VENDORS_UPLOAD_LWF_CERTIFICATE: '/vendors/vendor-files/upload-lwf-certificate',
    VENDORS_UPLOAD_CANCELLED_CHEQUE: '/vendors/vendor-files/upload-cancelled-cheque',
};

export const API_PUT = {
    TEST: '/',
    VENDOR_APPROVE: '/vendors/:id/approve',
    VENDOR_REJECT: '/vendors/:id/reject',
    VENDOR_RESEND_INVITATION: '/vendors/onboarding/:id/resend-invitation',
    VENDOR_APPROVE_STEP: '/vendors/:id/approve/:step',
    VENDOR_REJECT_STEP: '/vendors/:id/reject/:step',
    VENDOR_FINAL_APPROVE: '/vendors/:id/final-approve',
    VENDOR_REINITIATE: '/vendors/:id/final-reject'
};

export const API_PATCH = {
    TEST: '/'
};

export const API_DELETE = {
    TEST: '/',
    DELETE_SUB_ENTITY: '/client/:clientid/sub-entities/:subEntityId',
    DELETE_ADDRESS: '/client/:clientid/address/:addressId',
    DELETE_POC: '/client/:clientid/pocs/:pocId'
};