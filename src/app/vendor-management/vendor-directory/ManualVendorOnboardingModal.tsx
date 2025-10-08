'use client'

import React, { useState, useEffect } from 'react';
import { X, FileText, RefreshCw, Search, Plus, Upload, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import GSTINFetchModal from './GSTINFetchModal';
import InnerSidebar from '@/components/InnerSidebar';
import Header from '@/components/Header';
import InputBox from '@/common/inputbox';
import UploadCloud02 from '@/assets/svg/upload-cloud-02';
import PdfSvg from '@/assets/svg/pdfsvg';
import CustomDatePicker from '@/common/CustomDatePicker';
import { calculateContractTenure } from '@/common/commonfunction';
import { Post, PostWithFormData, Put, Get } from '@/common/axios/api';
import { API_POST, API_GET } from '@/common/constant/api';
import { useToast } from '@/contexts/ToastContext';

interface ManualVendorOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Country {
    id: string;
    name: string;
    iso3: string;
    numeric_code: string;
    phonecode: string;
}

interface State {
    id: string;
    name: string;
    country_id: string;
    country_code: string;
    iso2: string;
}

interface City {
    id: string;
    name: string;
    state_id: string;
    state_code: string;
    country_id: string;
    country_code: string;
}

const ManualVendorOnboardingModal: React.FC<ManualVendorOnboardingModalProps> = ({
    isOpen,
    onClose,

}) => {
    const { showSuccess } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isGSTINModalOpen, setIsGSTINModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isStepValid, setIsStepValid] = useState(false);
    const [vendorId, setVendorId] = useState('');
    const [formData, setFormData] = useState({
        // Basic Details
        vendorFullName: '',
        vendorShortName: '',
        // vendorId: 'AD12123',
        pocName: '',
        emailId: '',
        phoneNumber: '',

        // Contract Details
        contractFile: null as File | null,
        contractStartDate: '',
        contractEndDate: '',
        tenure: '',
        margin: '',

        // Billing & Invoicing Details
        gstRegistered: true,
        gstin: '',
        gstState: '',
        gstTreatment: '',
        msmeRegistered: true,
        msmeType: ''
    });

    console.log(formData, "formDataformDataformDataformDataformDataformDataformDataformData")

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            address: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
        }
    ]);

    const [otherDetails, setOtherDetails] = useState({
        // PF Details
        pfNumber: '',
        pfEstablishmentName: '',
        pfCertificate: null as File | null,

        // ESIC Details
        esicId: '',
        esicBranch: '',
        esicSubCodes: [] as { id: number; code: string; branch: string }[],
        esicCertificate: null as File | null,

        // PT Details
        ptState: '',
        ptId: '',
        ptCertificate: null as File | null,

        // LWF Details
        lwfState: '',
        lwfId: '',
        lwfCertificate: null as File | null,

        // Other Details
        pan: '',
        tan: '',

        // Bank Details
        accountNumber: '',
        accountHolderName: '',
        bankName: '',
        bankBranch: '',
        ifsc: '',
        cancelledCheque: null as File | null,

        // Stakeholders
        stakeholders: [
            {
                name: '',
                designation: '',
                email: ''
            }
        ],
    });

    // Countries state
    const [countries, setCountries] = useState<Country[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(false);

    // States state - keyed by address ID
    const [states, setStates] = useState<{ [addressId: number]: State[] }>({});
    const [statesLoading, setStatesLoading] = useState<{ [addressId: number]: boolean }>({});

    // Cities state - keyed by address ID
    const [cities, setCities] = useState<{ [addressId: number]: City[] }>({});
    const [citiesLoading, setCitiesLoading] = useState<{ [addressId: number]: boolean }>({});

    const clearAllData = () => {
        setCurrentStep(1);
        setCompletedSteps(0);
        setErrors({});
        setIsStepValid(false);
        setVendorId('');
        setFormData({
            // Basic Details
            vendorFullName: '',
            vendorShortName: '',
            // vendorId: 'AD12123',
            pocName: '',
            emailId: '',
            phoneNumber: '',

            // Contract Details
            contractFile: null as File | null,
            contractStartDate: '',
            contractEndDate: '',
            tenure: '',
            margin: '',

            // Billing & Invoicing Details
            gstRegistered: true,
            gstin: '',
            gstState: '',
            gstTreatment: '',
            msmeRegistered: true,
            msmeType: ''
        });
        setAddresses([
            {
                id: 1,
                address: '',
                country: '',
                state: '',
                city: '',
                pincode: '',
            }
        ]);
        setOtherDetails({
            // PF Details
            pfNumber: '',
            pfEstablishmentName: '',
            pfCertificate: null as File | null,

            // ESIC Details
            esicId: '',
            esicBranch: '',
            esicSubCodes: [] as { id: number; code: string; branch: string }[],
            esicCertificate: null as File | null,

            // PT Details
            ptState: '',
            ptId: '',
            ptCertificate: null as File | null,

            // LWF Details
            lwfState: '',
            lwfId: '',
            lwfCertificate: null as File | null,

            // Other Details
            pan: '',
            tan: '',

            // Bank Details
            accountNumber: '',
            accountHolderName: '',
            bankName: '',
            bankBranch: '',
            ifsc: '',
            cancelledCheque: null as File | null,

            // Stakeholders
            stakeholders: [
                {
                    name: '',
                    designation: '',
                    email: ''
                }
            ],
        });
    }

    useEffect(() => {
        clearAllData();
    }, [isOpen, onClose]);

    // Fetch countries on component mount
    useEffect(() => {
        const loadCountries = async () => {
            setCountriesLoading(true);
            try {
                const response = await Get<{ data: { rows: Country[] } }>(API_GET.COUNTRIES);
                setCountries(response.data.data.rows);
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setCountriesLoading(false);
            }
        };

        if (isOpen) {
            loadCountries();
        }
    }, [isOpen]);

    // Function to fetch states by country_id for specific address
    const fetchStatesByCountry = async (countryId: string, addressId: number) => {
        setStatesLoading(prev => ({ ...prev, [addressId]: true }));
        setStates(prev => ({ ...prev, [addressId]: [] })); // Clear previous states for this address
        try {
            const response = await Get<{ data: { rows: State[] } }>(`${API_GET.STATES}?country_id=${countryId}`);
            setStates(prev => ({ ...prev, [addressId]: response.data.data.rows }));
        } catch (error) {
            console.error('Error fetching states:', error);
        } finally {
            setStatesLoading(prev => ({ ...prev, [addressId]: false }));
        }
    };

    // Function to fetch cities by state_id for specific address
    const fetchCitiesByState = async (stateId: string, addressId: number) => {
        setCitiesLoading(prev => ({ ...prev, [addressId]: true }));
        setCities(prev => ({ ...prev, [addressId]: [] })); // Clear previous cities for this address
        try {
            const response = await Get<{ data: { rows: City[] } }>(`${API_GET.CITIES}?state_id=${stateId}`);
            setCities(prev => ({ ...prev, [addressId]: response.data.data.rows }));
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setCitiesLoading(prev => ({ ...prev, [addressId]: false }));
        }
    };

    const steps = [
        {
            id: 1,
            title: 'Basic details',
            description: 'Details about the vendor',
            icon: <FileText size={20} />,
            active: currentStep === 1,
            completed: currentStep > 1
        },
        {
            id: 2,
            title: 'Contract details',
            description: 'Details about billing',
            icon: <FileText size={20} />,
            active: currentStep === 2,
            completed: currentStep > 2
        },
        {
            id: 3,
            title: 'Billing & Invoicing details',
            description: 'Details about billing',
            icon: <FileText size={20} />,
            active: currentStep === 3,
            completed: currentStep > 3
        },
        {
            id: 4,
            title: 'Other details',
            description: 'Statutory & account details',
            icon: <FileText size={20} />,
            active: currentStep === 4,
            completed: currentStep > 4
        }
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
        }));
    };

    const handleAddressChange = (addressId: number, field: string, value: string) => {
        setAddresses(prev => prev.map(addr =>
            addr.id === addressId ? { ...addr, [field]: value } : addr
        ));

        // If country is changed, fetch states for that country and clear state field
        if (field === 'country' && value) {
            // Clear the state and city fields when country changes
            setAddresses(prev => prev.map(addr =>
                addr.id === addressId ? { ...addr, state: '', city: '' } : addr
            ));
            fetchStatesByCountry(value, addressId);
        }

        // If state is changed, fetch cities for that state and clear city field
        if (field === 'state' && value) {
            // Clear the city field when state changes
            setAddresses(prev => prev.map(addr =>
                addr.id === addressId ? { ...addr, city: '' } : addr
            ));
            fetchCitiesByState(value, addressId);
        }
    };
    const addNewAddress = () => {
        const newId = Math.max(...addresses.map(addr => addr.id), 0) + 1;
        setAddresses(prev => [...prev, {
            id: newId,
            address: '',
            country: '',
            state: '',
            city: '',
            pincode: ''
        }]);

        // Initialize empty states and cities for the new address
        setStates(prev => ({ ...prev, [newId]: [] }));
        setCities(prev => ({ ...prev, [newId]: [] }));
        setStatesLoading(prev => ({ ...prev, [newId]: false }));
        setCitiesLoading(prev => ({ ...prev, [newId]: false }));
    };

    const removeAddress = (addressId: number) => {
        if (addresses.length > 1) {
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));

            // Clean up states and cities data for the removed address
            setStates(prev => {
                const newStates = { ...prev };
                delete newStates[addressId];
                return newStates;
            });
            setCities(prev => {
                const newCities = { ...prev };
                delete newCities[addressId];
                return newCities;
            });
            setStatesLoading(prev => {
                const newLoading = { ...prev };
                delete newLoading[addressId];
                return newLoading;
            });
            setCitiesLoading(prev => {
                const newLoading = { ...prev };
                delete newLoading[addressId];
                return newLoading;
            });
        }
    };

    const handleOtherDetailsChange = (field: string, value: any) => {
        setOtherDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addStakeholder = () => {
        setOtherDetails(prev => ({
            ...prev,
            stakeholders: [...prev.stakeholders, {
                name: '',
                designation: '',
                email: ''
            }]
        }));
    };

    const removeStakeholder = (index: number) => {
        if (otherDetails.stakeholders.length > 1) {
            setOtherDetails(prev => ({
                ...prev,
                stakeholders: prev.stakeholders.filter((_, i) => i !== index)
            }));
        }
    };

    const handleStakeholderChange = (index: number, field: string, value: string) => {
        setOtherDetails(prev => ({
            ...prev,
            stakeholders: prev.stakeholders.map((stakeholder, i) =>
                i === index ? { ...stakeholder, [field]: value } : stakeholder
            )
        }));
    };


    const addEsicSubCode = () => {
        const newId = Math.max(...otherDetails.esicSubCodes.map(code => code.id), 0) + 1;
        setOtherDetails(prev => ({
            ...prev,
            esicSubCodes: [...prev.esicSubCodes, { id: newId, code: '', branch: '' }]
        }));
    };

    const removeEsicSubCode = (id: number) => {
        setOtherDetails(prev => ({
            ...prev,
            esicSubCodes: prev.esicSubCodes.filter(code => code.id !== id)
        }));
    };

    const handleEsicSubCodeChange = (id: number, field: string, value: string) => {
        setOtherDetails(prev => ({
            ...prev,
            esicSubCodes: prev.esicSubCodes.map(code =>
                code.id === id ? { ...code, [field]: value } : code
            )
        }));
    };

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    const validateGSTIN = (gstin: string): boolean => {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex.test(gstin);
    };

    const validatePAN = (pan: string): boolean => {
        const panRegex = /^[A-Z]{6}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const validateIFSC = (ifsc: string): boolean => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const validateStep1 = (): { isValid: boolean; errors: { [key: string]: string } } => {
        const newErrors: { [key: string]: string } = {};

        // Validate vendor details
        if (!formData.vendorFullName.trim()) {
            newErrors.vendorFullName = 'Vendor full name is required';
        }

        if (!formData.vendorShortName.trim()) {
            newErrors.vendorShortName = 'Vendor short name is required';
        }

        // if (!formData.vendorId.trim()) {
        //     newErrors.vendorId = 'Vendor ID is required';
        // }

        // Validate addresses
        addresses.forEach((address, index) => {
            if (!address.address.trim()) {
                newErrors[`address_${address.id}_address`] = 'Address is required';
            }
            if (!address.country) {
                newErrors[`address_${address.id}_country`] = 'Country is required';
            }
            if (!address.state) {
                newErrors[`address_${address.id}_state`] = 'State is required';
            }
            if (!address.city) {
                newErrors[`address_${address.id}_city`] = 'City is required';
            }
            if (!address.pincode.trim()) {
                newErrors[`address_${address.id}_pincode`] = 'Pincode is required';
            } else if (!/^\d{6}$/.test(address.pincode)) {
                newErrors[`address_${address.id}_pincode`] = 'Pincode must be exactly 6 digits';
            }
        });

        // Validate POC details
        if (!formData.pocName.trim()) {
            newErrors.pocName = 'POC name is required';
        }

        if (!formData.emailId.trim()) {
            newErrors.emailId = 'Email ID is required';
        } else if (!validateEmail(formData.emailId)) {
            newErrors.emailId = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
        }

        return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const validateStep2 = (): { isValid: boolean; errors: { [key: string]: string } } => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.contractFile) {
            newErrors.contractFile = 'Contract file is required';
        }

        if (!formData.contractStartDate) {
            newErrors.contractStartDate = 'Contract start date is required';
        }

        if (!formData.contractEndDate) {
            newErrors.contractEndDate = 'Contract end date is required';
        } else if (formData.contractStartDate && formData.contractEndDate <= formData.contractStartDate) {
            newErrors.contractEndDate = 'End date must be after start date';
        }

        if (!formData.margin) {
            newErrors.margin = 'Margin is required';
        }

        return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const validateStep3 = (): { isValid: boolean; errors: { [key: string]: string } } => {
        const newErrors: { [key: string]: string } = {};

        if (formData.gstRegistered) {
            if (!formData.gstin.trim()) {
                newErrors.gstin = 'GSTIN is required when GST registered';
            } else if (!validateGSTIN(formData.gstin)) {
                newErrors.gstin = 'Please enter a valid GSTIN like 09AAACH7409R1Z1';
            }

            if (!formData.gstState.trim()) {
                newErrors.gstState = 'GST state is required';
            }

            if (!formData.gstTreatment) {
                newErrors.gstTreatment = 'GST treatment is required';
            }
        }

        if (formData.msmeRegistered && !formData.msmeType) {
            newErrors.msmeType = 'MSME type is required when MSME registered';
        }

        return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const validateStep4 = (): { isValid: boolean; errors: { [key: string]: string } } => {
        const newErrors: { [key: string]: string } = {};

        // Validate PF details
        if (!otherDetails.pfNumber.trim()) {
            newErrors.pfNumber = 'PF number is required';
        }

        if (!otherDetails.pfEstablishmentName.trim()) {
            newErrors.pfEstablishmentName = 'PF establishment name is required';
        }

        if (!otherDetails.pfCertificate) {
            newErrors.pfCertificate = 'PF registration certificate is required';
        }

        // Validate ESIC details
        if (!otherDetails.esicId.trim()) {
            newErrors.esicId = 'ESIC ID is required';
        }

        if (!otherDetails.esicBranch.trim()) {
            newErrors.esicBranch = 'ESIC branch is required';
        }

        if (!otherDetails.esicCertificate) {
            newErrors.esicCertificate = 'ESIC registration certificate is required';
        }

        // Validate ESIC sub-codes
        otherDetails.esicSubCodes.forEach((subCode, index) => {
            if (!subCode.code.trim()) {
                newErrors[`esic_subcode_${subCode.id}_code`] = 'ESIC sub-code is required';
            }
            if (!subCode.branch.trim()) {
                newErrors[`esic_subcode_${subCode.id}_branch`] = 'ESIC sub-code branch is required';
            }
        });

        // Validate PT details
        if (!otherDetails.ptState) {
            newErrors.ptState = 'PT state is required';
        }

        if (!otherDetails.ptId.trim()) {
            newErrors.ptId = 'PT ID is required';
        }

        if (!otherDetails.ptCertificate) {
            newErrors.ptCertificate = 'PT registration certificate is required';
        }

        // Validate LWF details
        if (!otherDetails.lwfState) {
            newErrors.lwfState = 'LWF state is required';
        }

        if (!otherDetails.lwfId.trim()) {
            newErrors.lwfId = 'LWF ID is required';
        }

        if (!otherDetails.lwfCertificate) {
            newErrors.lwfCertificate = 'LWF registration certificate is required';
        }

        // Validate PAN and TAN
        if (!otherDetails.pan.trim()) {
            newErrors.pan = 'PAN is required';
        } else if (!validatePAN(otherDetails.pan)) {
            newErrors.pan = 'Please enter a valid PAN like AAAAAA1234A';
        }

        if (!otherDetails.tan.trim()) {
            newErrors.tan = 'TAN is required';
        }

        // Validate bank details
        if (!otherDetails.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required';
        }

        if (!otherDetails.accountHolderName.trim()) {
            newErrors.accountHolderName = 'Account holder name is required';
        }

        if (!otherDetails.bankName.trim()) {
            newErrors.bankName = 'Bank name is required';
        }

        if (!otherDetails.bankBranch.trim()) {
            newErrors.bankBranch = 'Bank branch is required';
        }

        if (!otherDetails.ifsc.trim()) {
            newErrors.ifsc = 'IFSC is required';
        } else if (!validateIFSC(otherDetails.ifsc)) {
            newErrors.ifsc = 'Please enter a valid IFSC code like ABCD0123456';
        }

        if (!otherDetails.cancelledCheque) {
            newErrors.cancelledCheque = 'Cancelled cheque is required';
        }

        // Validate stakeholders
        otherDetails.stakeholders.forEach((stakeholder, index) => {
            if (!stakeholder.name.trim()) {
                newErrors[`stakeholder_${index}_name`] = 'Stakeholder name is required';
            }
            if (!stakeholder.designation.trim()) {
                newErrors[`stakeholder_${index}_designation`] = 'Stakeholder designation is required';
            }
            if (!stakeholder.email.trim()) {
                newErrors[`stakeholder_${index}_email`] = 'Stakeholder email is required';
            } else if (!validateEmail(stakeholder.email)) {
                newErrors[`stakeholder_${index}_email`] = 'Please enter a valid email address';
            }
        });

        return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const validateCurrentStep = (): { isValid: boolean; errors: { [key: string]: string } } => {
        switch (currentStep) {
            case 1:
                return validateStep1();
            case 2:
                return validateStep2();
            case 3:
                return validateStep3();
            case 4:
                return validateStep4();
            default:
                return { isValid: false, errors: {} };
        }
    };

    // Effect to validate current step whenever form data changes
    useEffect(() => {
        // Only validate if there are existing errors (after user has tried to submit)
        if (Object.keys(errors).length > 0) {
            const validation = validateCurrentStep();
            setIsStepValid(validation.isValid);
        }
    }, [formData, addresses, otherDetails, currentStep, errors, validateCurrentStep]);

    // Helper component to display error messages
    const ErrorMessage = ({ error }: { error: string }) => (
        <div className="flex items-center mt-1 text-red-600 text-sm">
            {error}
        </div>
    );


    // const handleSaveAndProceed = () => {
    //     if (currentStep < 4) {
    //         setCurrentStep(currentStep + 1);
    //         setCompletedSteps(completedSteps + 1);
    //     } else {
    //         onSaveAndProceed(formData);
    //         onClose();
    //     }
    // };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field?: string) => {
        const file = event.target.files?.[0];
        if (file) {
            if (field) {
                setOtherDetails(prev => ({
                    ...prev,
                    [field]: file
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    contractFile: file
                }));
            }
        }
    };

    const handleFetchGSTINDetails = (gstin: string) => {
        console.log('Fetching details for GSTIN:', gstin);
        // This function is called when GSTIN is fetched, but the actual data is handled in the GSTIN modal
    };

    const handleAutoFillDetails = (details: any) => {
        console.log('Auto-filling details:', details);
        setFormData(prev => ({
            ...prev,
            vendorFullName: details.companyName,
            vendorShortName: details.businessTradeName,
            // vendorId: details.gstin || prev.vendorId, // Use GSTIN from details or keep existing
            address: details.address.join(', '),
            gstin: details.gstin,
            // You can map more fields as needed
        }));
    };

    const Basicdetailssavedandproceed = async () => {
        const validation = validateStep1();
        setErrors(validation.errors);
        setIsStepValid(validation.isValid);

        if (!validation.isValid) {
            return;
        }

        const addressData = addresses.map((address, index) => ({
            label: "This is dummy label",
            address_line1: address.address,
            city: address.city,
            state: address.state,
            country: address.country,
            postal_code: address.pincode,
        }));
        const data = {
            full_name: formData.vendorFullName,
            short_name: formData.vendorShortName,
            // gstin: "09AAACH7409R1Z1",
            addresses: addressData,
            pocs: [
                {
                    name: formData.pocName,
                    email: formData.emailId,
                    phone: formData.phoneNumber,
                },
            ]
        }
        const response = await Post<any>(API_POST.VENDORS_ONBOARDING_DETAILS, data)
        console.log(response, "datadatadatadatadatadatadatadatadata")

        if (response.data.code === 201 || response.data.code === 200) {
            setVendorId(response.data.data.vendor_id);
            setCurrentStep(2);
            setCompletedSteps(1);
        }
    }

    const Contractdetailssavedandproceed = async () => {
        const validation = validateStep2();
        setErrors(validation.errors);
        setIsStepValid(validation.isValid);

        if (!validation.isValid) {
            return;
        }

        const data = {
            vendor_id: vendorId,
            start_date: new Date(formData.contractStartDate).toISOString(),
            end_date: new Date(formData.contractEndDate).toISOString(),
            margin_percent: parseInt(formData.margin),
        }
        const response = await Post<any>(API_POST.VENDORS_ONBOARDING_CONTRACT_DETAILS, data)
        console.log(response, "datadatadatadatadatadatadatadatadata");

        if (response.data.code === 201 || response.data.code === 200) {
            setVendorId(response.data.data.vendor_id);
            setCurrentStep(3);
            setCompletedSteps(2);
        }
        // Move to next step
    }

    const fileUploadData = {
        vendor_id: vendorId,
        file: formData.contractFile as File,
    }

    const handleorganizationlogoupload = async () => {
        try {
            const formData = new FormData();
            formData.append('vendor_id', fileUploadData.vendor_id || '');
            formData.append('file', fileUploadData.file as File);
            const response = await PostWithFormData<any>(API_POST.VENDORS_ONBOARDING_UPLOAD_CONTRACT_DOCUMENT, formData)
            console.log("response", response);
            if (response.code === 200 || response.code === 201) {

            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
        }
    }

    useEffect(() => {
        if (formData.contractFile !== null) {
            handleorganizationlogoupload();
        }
    }, [formData.contractFile]);

    const BillingandInvoicingdetailssavedandproceed = async () => {
        const validation = validateStep3();
        setErrors(validation.errors);
        setIsStepValid(validation.isValid);

        if (!validation.isValid) {
            return;
        }

        const data = {
            vendor_id: vendorId,
            gstin: formData.gstin,
            gst_state: formData.gstState,
            gst_treatment: formData.gstTreatment,
            gst_registered: formData.gstRegistered,
            msme_type: formData.msmeType,
            msme_registered: formData.msmeRegistered,
        }
        const response = await Post<any>(API_POST.VENDORS_ONBOARDING_BILLING_INVOICE_DETAILS, data)
        console.log(data, "datadatadatadatadatadatadatadatadata");

        if (response.data.code === 201 || response.data.code === 200) {
            setVendorId(response.data.data.vendor_id);
            setCurrentStep(4);
            setCompletedSteps(3);
        }
    }

    const Otherdetailsavedandproceed = async () => {
        const validation = validateStep4();
        setErrors(validation.errors);
        setIsStepValid(validation.isValid);

        if (!validation.isValid) {
            return;
        }

        const SubCodes = otherDetails.esicSubCodes.map((subCode) => ({
            sub_code: subCode.code,
            branch: subCode.branch
        }));
        const stakeholders = otherDetails.stakeholders.map((item) => ({
            name: item.name,
            designation: item.designation,
            email: item.email,
        }));
        const data = {
            vendor_id: vendorId,
            establishment_pf_number: otherDetails.pfNumber,
            establishment_name: otherDetails.pfEstablishmentName,
            esic_id: otherDetails.esicId,
            branch: otherDetails.esicBranch,
            sub_codes: SubCodes,
            pt_state: otherDetails.ptState,
            pt_id: otherDetails.ptId,
            lwf_state: otherDetails.lwfState,
            lwf_id: otherDetails.lwfId,
            pan: otherDetails.pan,
            tan: otherDetails.tan,
            account_number: otherDetails.accountNumber,
            account_holder_name: otherDetails.accountHolderName,
            bank_name: otherDetails.bankName,
            bank_branch: otherDetails.bankBranch,
            ifsc: otherDetails.ifsc,
            vendor_stakeholders: stakeholders
        }
        console.log(data, "datadatadatadatadatadatadatadatadata");
        const response = await Post<any>(API_POST.VENDORS_ONBOARDING_OTHER_DETAILS, data)
        console.log(response, "datadatadatadatadatadatadatadatadata");

        if (response.data.code === 201 || response.data.code === 200) {
            showSuccess('Form submitted successfully!');
            setCurrentStep(5);
            setCompletedSteps(4);
            onClose();
        }
    }
    const handlePFCertificateUpload = async () => {
        try {
            if (!otherDetails.pfCertificate || !vendorId) {
                return false;
            }

            const formData = new FormData();
            formData.append('vendor_id', vendorId);
            formData.append('file', otherDetails.pfCertificate);

            const response = await PostWithFormData<any>(API_POST.VENDORS_UPLOAD_PF_CERTIFICATE, formData);

            if (response.code === 200 || response.code === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        if (otherDetails.pfCertificate !== null) {
            handlePFCertificateUpload();
        }
    }, [otherDetails.pfCertificate]);

    const handleESICCertificateUpload = async () => {
        try {
            if (!otherDetails.esicCertificate || !vendorId) {
                return false;
            }
            const formData = new FormData();
            formData.append('vendor_id', vendorId);
            formData.append('file', otherDetails.esicCertificate);
            const response = await PostWithFormData<any>(API_POST.VENDORS_UPLOAD_ESIC_CERTIFICATE, formData);
            if (response.code === 200 || response.code === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        if (otherDetails.esicCertificate !== null) {
            handleESICCertificateUpload();
        }
    }, [otherDetails.esicCertificate]);


    const handlePTCertificateUpload = async () => {
        try {
            if (!otherDetails.ptCertificate || !vendorId) {
                return false;
            }
            const formData = new FormData();
            formData.append('vendor_id', vendorId);
            formData.append('file', otherDetails.ptCertificate);
            const response = await PostWithFormData<any>(API_POST.VENDORS_UPLOAD_PT_CERTIFICATE, formData);
            if (response.code === 200 || response.code === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        if (otherDetails.ptCertificate !== null) {
            handlePTCertificateUpload();
        }
    }, [otherDetails.ptCertificate]);

    const handleLWFCertificateUpload = async () => {
        try {
            if (!otherDetails.lwfCertificate || !vendorId) {
                return false;
            }
            const formData = new FormData();
            formData.append('vendor_id', vendorId);
            formData.append('file', otherDetails.lwfCertificate);
            const response = await PostWithFormData<any>(API_POST.VENDORS_UPLOAD_LWF_CERTIFICATE, formData);
            if (response.code === 200 || response.code === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        if (otherDetails.lwfCertificate !== null) {
            handleLWFCertificateUpload();
        }
    }, [otherDetails.lwfCertificate]);

    const handleCancelledChequeUpload = async () => {
        try {
            if (!otherDetails.cancelledCheque || !vendorId) {
                return false;
            }
            const formData = new FormData();
            formData.append('vendor_id', vendorId);
            formData.append('file', otherDetails.cancelledCheque);
            const response = await PostWithFormData<any>(API_POST.VENDORS_UPLOAD_CANCELLED_CHEQUE, formData);
            if (response.code === 200 || response.code === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    useEffect(() => {
        if (otherDetails.cancelledCheque !== null) {
            handleCancelledChequeUpload();
        }
    }, [otherDetails.cancelledCheque]);




    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-0 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-[99%] m-auto h-[99vh] transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                {/* <div className="bg-[#7F56D9] px-6 py-4 flex justify-between items-center">
                                    <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                                        Add vendor
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div> */}
                                <Header
                                    title="Add vendor"
                                    onMenuClick={() => setIsSidebarOpen(true)}
                                    showMenuButton={true}
                                    showCloseButton={true}
                                    closebuttononclick={onClose}
                                />

                                <div className="flex h-full relative">
                                    {/* Left Sidebar - Steps */}
                                    <InnerSidebar
                                        step={currentStep}
                                        setStep={setCurrentStep}
                                        isSidebarOpen={isSidebarOpen}
                                        setIsSidebarOpen={setIsSidebarOpen}
                                        stepsData={steps}
                                        title="STEPS TO BE COMPLETED"
                                        completedCount={completedSteps}
                                        totalCount={steps.length}
                                    />

                                    {/* Main Content Area */}
                                    <div className="flex-1 overflow-y-auto p-6 lg:ml-0">
                                        <div className="max-w-5xl">
                                            {/* Step 1: Basic Details */}
                                            {currentStep === 1 && (
                                                <>
                                                    {/* Vendor Details Section */}
                                                    <div className="mb-8">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor details</h3>
                                                        <div className="bg-[#F9FAFB] p-4 rounded-lg">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor full name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g. Capgemini limited"
                                                                        value={formData.vendorFullName}
                                                                        onChange={(e) => handleInputChange('vendorFullName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.vendorFullName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.vendorFullName && <ErrorMessage error={errors.vendorFullName} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor short name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g. Capgemini"
                                                                        value={formData.vendorShortName}
                                                                        onChange={(e) => handleInputChange('vendorShortName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.vendorShortName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.vendorShortName && <ErrorMessage error={errors.vendorShortName} />}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                {/* <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Vendor ID
                                                                </label> */}
                                                                <div className="flex items-center justify-end w-full">
                                                                    {/* <InputBox
                                                                        type="text"
                                                                        value={formData.vendorId}
                                                                        onChange={(e) => handleInputChange('vendorId', e)}
                                                                        variant="gray"
                                                                        className={`w-[90%] bg-white ${errors.vendorId ? 'border-red-500' : ''}`}
                                                                    /> */}
                                                                    <button
                                                                        onClick={() => setIsGSTINModalOpen(true)}
                                                                        className="flex w-[30%] items-center justify-end space-x-2 text-purple hover:text-purple-700 transition-colors "
                                                                    >
                                                                        <RefreshCw size={16} />
                                                                        <span className="text-sm">Fetch details from GSTIN</span>
                                                                    </button>
                                                                </div>
                                                                {errors.vendorId && <ErrorMessage error={errors.vendorId} />}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Vendor Address Section */}
                                                    <div className="mb-8">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-semibold text-gray-900">Vendor address</h3>
                                                            <button
                                                                onClick={addNewAddress}
                                                                className="flex items-center space-x-2 text-purple hover:text-purple-700 transition-colors"
                                                            >
                                                                <Plus size={16} />
                                                                <span className="text-sm font-[600]">Add address</span>
                                                            </button>
                                                        </div>

                                                        {addresses.map((address, index) => (
                                                            <div key={address.id} className="space-y-6 mb-8 p-6 border border-gray-200 bg-[#F9FAFB] rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-md font-medium text-gray-800">Address {index + 1}</h4>
                                                                    {addresses.length > 1 && (
                                                                        <button
                                                                            onClick={() => removeAddress(address.id)}
                                                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div className="w-full">
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Address
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter address"
                                                                        value={address.address}
                                                                        onChange={(e) => handleAddressChange(address.id, 'address', e)}
                                                                        leftIcon={<Search className="w-4 h-4" />}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors[`address_${address.id}_address`] ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors[`address_${address.id}_address`] && <ErrorMessage error={errors[`address_${address.id}_address`]} />}
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                            Country
                                                                        </label>
                                                                        <InputBox
                                                                            type="select"
                                                                            placeholder={countriesLoading ? "Loading countries..." : "Select country"}
                                                                            value={address.country}
                                                                            onChange={(e) => handleAddressChange(address.id, 'country', e)}
                                                                            options={countries.map(country => ({
                                                                                value: country.id,
                                                                                label: country.name
                                                                            }))}
                                                                            variant="gray"
                                                                            className={`bg-white ${errors[`address_${address.id}_country`] ? 'border-red-500' : ''}`}
                                                                            disabled={countriesLoading}
                                                                        />
                                                                        {errors[`address_${address.id}_country`] && <ErrorMessage error={errors[`address_${address.id}_country`]} />}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                            State
                                                                        </label>
                                                                        <InputBox
                                                                            type="select"
                                                                            placeholder={statesLoading[address.id] ? "Loading states..." : "Select state"}
                                                                            value={address.state}
                                                                            onChange={(e) => handleAddressChange(address.id, 'state', e)}
                                                                            options={(states[address.id] || []).map(state => ({
                                                                                value: state.id,
                                                                                label: state.name
                                                                            }))}
                                                                            variant="gray"
                                                                            className={`bg-white ${errors[`address_${address.id}_state`] ? 'border-red-500' : ''}`}
                                                                            disabled={statesLoading[address.id] || !address.country}
                                                                        />
                                                                        {errors[`address_${address.id}_state`] && <ErrorMessage error={errors[`address_${address.id}_state`]} />}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                            City
                                                                        </label>
                                                                        <InputBox
                                                                            type="select"
                                                                            placeholder={citiesLoading[address.id] ? "Loading cities..." : "Select city"}
                                                                            value={address.city}
                                                                            onChange={(e) => handleAddressChange(address.id, 'city', e)}
                                                                            options={(cities[address.id] || []).map(city => ({
                                                                                value: city.id,
                                                                                label: city.name
                                                                            }))}
                                                                            variant="gray"
                                                                            className={`bg-white ${errors[`address_${address.id}_city`] ? 'border-red-500' : ''}`}
                                                                            disabled={citiesLoading[address.id] || !address.state}
                                                                        />
                                                                        {errors[`address_${address.id}_city`] && <ErrorMessage error={errors[`address_${address.id}_city`]} />}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                            Pincode
                                                                        </label>
                                                                        <InputBox
                                                                            type="text"
                                                                            placeholder="Enter pincode"
                                                                            value={address.pincode}
                                                                            onChange={(e) => {
                                                                                const value = e.replace(/\D/g, '').slice(0, 6);
                                                                                handleAddressChange(address.id, 'pincode', value);
                                                                            }}
                                                                            variant="gray"
                                                                            className={`bg-white ${errors[`address_${address.id}_pincode`] ? 'border-red-500' : ''}`}
                                                                        />
                                                                        {errors[`address_${address.id}_pincode`] && <ErrorMessage error={errors[`address_${address.id}_pincode`]} />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Vendor Point of Contact Section */}
                                                    <div className="mb-8">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor point of contact</h3>
                                                        <div className="space-y-6 p-6 border border-gray-200 bg-[#F9FAFB] rounded-lg">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        POC name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter name"
                                                                        value={formData.pocName}
                                                                        onChange={(e) => handleInputChange('pocName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.pocName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.pocName && <ErrorMessage error={errors.pocName} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Email ID
                                                                    </label>
                                                                    <InputBox
                                                                        type="email"
                                                                        placeholder="Enter email"
                                                                        value={formData.emailId}
                                                                        onChange={(e) => handleInputChange('emailId', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.emailId ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.emailId && <ErrorMessage error={errors.emailId} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Phone number
                                                                    </label>
                                                                    <InputBox
                                                                        type="tel"
                                                                        placeholder="Enter mobile number"
                                                                        value={formData.phoneNumber}
                                                                        onChange={(e) => {
                                                                            const value = e.replace(/\D/g, '').slice(0, 10);
                                                                            handleInputChange('phoneNumber', value);
                                                                        }}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.phoneNumber && <ErrorMessage error={errors.phoneNumber} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-3 pt-6 mt-6 mb-16 border-t border-gray-200">
                                                        {/* <button
                                                            onClick={onClose}
                                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                                                        >
                                                            Cancel
                                                        </button> */}
                                                        <button
                                                            onClick={Basicdetailssavedandproceed}
                                                            className="px-6 py-2 bg-purple hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                        >
                                                            Save & proceed
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Step 2: Contract Details */}
                                            {currentStep === 2 && (
                                                <>
                                                    <div className="mb-8">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract details</h3>

                                                        {/* Upload Contract Section */}
                                                        <div className="mb-6">
                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                Upload accepted contract
                                                            </label>
                                                            {errors.contractFile && <ErrorMessage error={errors.contractFile} />}
                                                            {!formData.contractFile ? (
                                                                <div
                                                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple transition-colors"
                                                                    onDragOver={(e) => {
                                                                        e.preventDefault();
                                                                        e.currentTarget.classList.add('border-purple', 'bg-purple-50');
                                                                    }}
                                                                    onDragLeave={(e) => {
                                                                        e.preventDefault();
                                                                        e.currentTarget.classList.remove('border-purple', 'bg-purple-50');
                                                                    }}
                                                                    onDrop={(e) => {
                                                                        e.preventDefault();
                                                                        e.currentTarget.classList.remove('border-purple', 'bg-purple-50');
                                                                        const files = e.dataTransfer.files;
                                                                        if (files.length > 0) {
                                                                            const file = files[0];
                                                                            // Check file type
                                                                            const allowedTypes = ['.pdf', '.doc', '.docx', '.svg', '.png', '.jpg', '.jpeg', '.gif'];
                                                                            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                                                                            if (allowedTypes.includes(fileExtension)) {
                                                                                // Check file size (10MB)
                                                                                if (file.size <= 10 * 1024 * 1024) {
                                                                                    setFormData(prev => ({ ...prev, contractFile: file }));
                                                                                } else {
                                                                                    alert('File size must be less than 10MB');
                                                                                }
                                                                            } else {
                                                                                alert('Please upload a valid file type (PDF, DOC, DOCX, SVG, PNG, JPG, GIF)');
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx,.svg,.png,.jpg,.jpeg,.gif"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                // Check file size (10MB)
                                                                                if (file.size <= 10 * 1024 * 1024) {
                                                                                    setFormData(prev => ({ ...prev, contractFile: file }));
                                                                                } else {
                                                                                    alert('File size must be less than 10MB');
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="hidden"
                                                                        id="contract-upload"
                                                                    />
                                                                    <label htmlFor="contract-upload" className="cursor-pointer">
                                                                        <div className="flex flex-col items-center space-y-4">
                                                                            <div className="h-[40px] w-[40px] border border-[#EAECF0] rounded-lg flex items-center justify-center">
                                                                                <UploadCloud02 />
                                                                            </div>
                                                                            <div>
                                                                                <span className="flex items-center gap-2 text-sm justify-center">
                                                                                    <p className="text-[#6941C6] font-[600]">click to upload</p>
                                                                                    <p className="text-[#475467] font-[400]">or drag and drop</p>
                                                                                </span>
                                                                                <p className="text-[12px] font-[400] text-[#475467] mt-1">PDF, DOC, SVG, PNG, JPG or GIF (max. 10MB)</p>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className={`w-10 h-12 rounded flex items-center justify-center`}>
                                                                                <PdfSvg />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-medium text-gray-900">{formData.contractFile.name}</p>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {(formData.contractFile.size / 1024).toFixed(0)} KB - 100% uploaded
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setFormData(prev => ({ ...prev, contractFile: null }))}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                            title="Remove file"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Contract Form Fields */}
                                                        <div className="bg-[#F9FAFB] p-4 rounded-lg">
                                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Contract start date
                                                                    </label>
                                                                    <CustomDatePicker
                                                                        value={formData.contractStartDate}
                                                                        onChange={(newStartDate) => {
                                                                            // Clear end date if it's before the new start date
                                                                            let newEndDate = formData.contractEndDate;
                                                                            if (formData.contractEndDate && newStartDate > formData.contractEndDate) {
                                                                                newEndDate = '';
                                                                            }
                                                                            const tenure = calculateContractTenure(newStartDate, newEndDate);
                                                                            setFormData({
                                                                                ...formData,
                                                                                contractStartDate: newStartDate,
                                                                                contractEndDate: newEndDate,
                                                                                tenure: tenure
                                                                            });
                                                                        }}
                                                                        placeholder="Pick a date"
                                                                    />
                                                                    {errors.contractStartDate && <ErrorMessage error={errors.contractStartDate} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Contract end date
                                                                    </label>
                                                                    <CustomDatePicker
                                                                        value={formData.contractEndDate}
                                                                        onChange={(newEndDate) => {
                                                                            const tenure = calculateContractTenure(formData.contractStartDate, newEndDate);
                                                                            setFormData({
                                                                                ...formData,
                                                                                contractEndDate: newEndDate,
                                                                                tenure: tenure
                                                                            });
                                                                        }}
                                                                        placeholder="Pick a date"
                                                                        min={formData.contractStartDate || undefined}
                                                                    />
                                                                    {errors.contractEndDate && <ErrorMessage error={errors.contractEndDate} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Tenure
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter details"
                                                                        value={formData.tenure}
                                                                        // onChange={(e) => handleInputChange('tenure', e)}
                                                                        variant="gray"
                                                                        disabled={true}
                                                                        className="bg-white"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Set margin
                                                                    </label>
                                                                    <InputBox
                                                                        type="select"
                                                                        placeholder="Choose your margin"
                                                                        value={formData.margin}
                                                                        onChange={(e) => handleInputChange('margin', e)}
                                                                        options={[
                                                                            { value: '2', label: '2%' },
                                                                            { value: '5', label: '5%' },
                                                                            { value: '10', label: '10%' },
                                                                            { value: '15', label: '15%' },
                                                                            { value: '20', label: '20%' }
                                                                        ]}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.margin ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.margin && <ErrorMessage error={errors.margin} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-3 pt-6 mt-6 mb-16 border-t border-gray-200">
                                                        {/* <button
                                                            onClick={onClose}
                                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                                                        >
                                                            Cancel
                                                        </button> */}
                                                        <button
                                                            onClick={Contractdetailssavedandproceed}
                                                            className="px-6 py-2 bg-purple hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                        >
                                                            Save & proceed
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Step 3: Billing & Invoicing Details */}
                                            {currentStep === 3 && (
                                                <>
                                                    <div className="mb-8">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing & Invoicing</h3>

                                                        {/* GST Registered Section */}
                                                        <div className="mb-8">
                                                            <div className="flex items-center space-x-3 mb-4">
                                                                <input
                                                                    type="checkbox"
                                                                    id="gst-registered"
                                                                    checked={formData.gstRegistered}
                                                                    onChange={(e) => handleCheckboxChange('gstRegistered', e.target.checked)}
                                                                    className="h-4 w-4 text-purple border-gray-300 rounded focus:ring-purple cursor-pointer"
                                                                />
                                                                <label htmlFor="gst-registered" className="text-sm font-medium text-gray-900">
                                                                    GST registered
                                                                </label>
                                                            </div>

                                                            {formData.gstRegistered && (
                                                                <div className="bg-[#F9FAFB] p-4 rounded-lg">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                GSTIN
                                                                            </label>
                                                                            <InputBox
                                                                                type="text"
                                                                                placeholder="Enter 12 digit code"
                                                                                value={formData.gstin}
                                                                                onChange={(e) => handleInputChange('gstin', e)}
                                                                                variant="gray"
                                                                                className={`bg-white ${errors.gstin ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors.gstin && <ErrorMessage error={errors.gstin} />}
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                GST state
                                                                            </label>
                                                                            <InputBox
                                                                                type="text"
                                                                                placeholder="Enter GST state"
                                                                                value={formData.gstState}
                                                                                onChange={(e) => handleInputChange('gstState', e)}
                                                                                variant="gray"
                                                                                className={`bg-white ${errors.gstState ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors.gstState && <ErrorMessage error={errors.gstState} />}
                                                                        </div>
                                                                        <div className="md:col-span-2">
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                Type of GST treatment
                                                                            </label>
                                                                            <InputBox
                                                                                type="select"
                                                                                placeholder="Choose option"
                                                                                value={formData.gstTreatment}
                                                                                onChange={(e) => handleInputChange('gstTreatment', e)}
                                                                                options={[
                                                                                    { value: 'Regular', label: 'Regular' },
                                                                                    { value: 'Composition', label: 'Composition' },
                                                                                    { value: 'Unregistered', label: 'Unregistered' }
                                                                                ]}
                                                                                variant="gray"
                                                                                className={`bg-white ${errors.gstTreatment ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors.gstTreatment && <ErrorMessage error={errors.gstTreatment} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* MSME Registered Section */}
                                                        <div className="mb-8">
                                                            <div className="flex items-center space-x-3 mb-4">
                                                                <input
                                                                    type="checkbox"
                                                                    id="msme-registered"
                                                                    checked={formData.msmeRegistered}
                                                                    onChange={(e) => handleCheckboxChange('msmeRegistered', e.target.checked)}
                                                                    className="h-4 w-4 text-purple border-gray-300 rounded focus:ring-purple cursor-pointer"
                                                                />
                                                                <label htmlFor="msme-registered" className="text-sm font-medium text-gray-900">
                                                                    MSME registered
                                                                </label>
                                                            </div>

                                                            {formData.msmeRegistered && (
                                                                <div className="bg-[#F9FAFB] p-4 rounded-lg">
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Type of MSME
                                                                    </label>
                                                                    <InputBox
                                                                        type="select"
                                                                        placeholder="Choose option"
                                                                        value={formData.msmeType}
                                                                        onChange={(e) => handleInputChange('msmeType', e)}
                                                                        options={[
                                                                            { value: 'Micro', label: 'Micro' },
                                                                            { value: 'Small', label: 'Small' },
                                                                            { value: 'Medium', label: 'Medium' }
                                                                        ]}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.msmeType ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.msmeType && <ErrorMessage error={errors.msmeType} />}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-3 pt-6 mt-6 mb-16 border-t border-gray-200">
                                                        {/* <button
                                                            onClick={onClose}
                                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                                                        >
                                                            Cancel
                                                        </button> */}
                                                        <button
                                                            onClick={BillingandInvoicingdetailssavedandproceed}
                                                            className="px-6 py-2 bg-purple hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                        >
                                                            Save & proceed
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Step 4: Other Details */}
                                            {currentStep === 4 && (
                                                <>
                                                    <div className="mb-8">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Other details</h3>

                                                        {/* Vendor's PF Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Vendor&apos;s PF details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment PF number
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g., MH/1234567/000/0000001"
                                                                        value={otherDetails.pfNumber}
                                                                        onChange={(e) => handleOtherDetailsChange('pfNumber', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.pfNumber ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.pfNumber && <ErrorMessage error={errors.pfNumber} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter establishment name"
                                                                        value={otherDetails.pfEstablishmentName}
                                                                        onChange={(e) => handleOtherDetailsChange('pfEstablishmentName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.pfEstablishmentName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.pfEstablishmentName && <ErrorMessage error={errors.pfEstablishmentName} />}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Attach PF registration certificate
                                                                </label>
                                                                {errors.pfCertificate && <ErrorMessage error={errors.pfCertificate} />}
                                                                {!otherDetails.pfCertificate ? (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={(e) => handleFileUpload(e, 'pfCertificate')}
                                                                            className="hidden"
                                                                            id="pf-certificate-upload"
                                                                        />
                                                                        <label htmlFor="pf-certificate-upload" className="cursor-pointer">
                                                                            <div className="flex flex-col items-center space-y-2">
                                                                                <Upload size={32} className="text-gray-400" />
                                                                                <p className="text-sm text-gray-600">
                                                                                    <span className="text-purple">Click to upload</span> or drag and drop
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">PDF (max. 5kb)</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="w-10 h-12 bg-red-500 rounded flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{otherDetails.pfCertificate.name}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(otherDetails.pfCertificate.size / (1024 * 1024)).toFixed(1)} MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOtherDetails(prev => ({ ...prev, pfCertificate: null }))}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Vendor's ESIC Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Vendor&apos;s ESIC details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s ESIC ID main code
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Eg.,MH/1234567890/0001"
                                                                        value={otherDetails.esicId}
                                                                        onChange={(e) => handleOtherDetailsChange('esicId', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.esicId ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.esicId && <ErrorMessage error={errors.esicId} />}
                                                                    <button
                                                                        onClick={addEsicSubCode}
                                                                        className="flex items-center space-x-1 text-purple hover:text-purple-700 transition-colors mt-2"
                                                                    >
                                                                        <Plus size={16} />
                                                                        <span className="text-sm font-[600]">Add sub-code</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Branch
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter branch"
                                                                        value={otherDetails.esicBranch}
                                                                        onChange={(e) => handleOtherDetailsChange('esicBranch', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.esicBranch ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.esicBranch && <ErrorMessage error={errors.esicBranch} />}
                                                                </div>
                                                            </div>
                                                            {otherDetails.esicSubCodes.map((subCode, index) => (
                                                                <div key={subCode.id} className="mt-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                ESIC sub-code
                                                                            </label>
                                                                            <InputBox
                                                                                type="text"
                                                                                placeholder="Enter sub-code"
                                                                                value={subCode.code}
                                                                                onChange={(e) => handleEsicSubCodeChange(subCode.id, 'code', e)}
                                                                                variant="gray"
                                                                                className={`bg-white ${errors[`esic_subcode_${subCode.id}_code`] ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors[`esic_subcode_${subCode.id}_code`] && <ErrorMessage error={errors[`esic_subcode_${subCode.id}_code`]} />}
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                Branch
                                                                            </label>
                                                                            <div className="flex items-center space-x-2">
                                                                                <InputBox
                                                                                    type="text"
                                                                                    placeholder="Enter branch"
                                                                                    value={subCode.branch}
                                                                                    onChange={(e) => handleEsicSubCodeChange(subCode.id, 'branch', e)}
                                                                                    variant="gray"
                                                                                    className={`bg-white flex-1 ${errors[`esic_subcode_${subCode.id}_branch`] ? 'border-red-500' : ''}`}
                                                                                />
                                                                                <button
                                                                                    onClick={() => removeEsicSubCode(subCode.id)}
                                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                                    title="Remove sub-code"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </div>
                                                                            {errors[`esic_subcode_${subCode.id}_branch`] && <ErrorMessage error={errors[`esic_subcode_${subCode.id}_branch`]} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="mt-4">
                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Attach ESIC registration certificate
                                                                </label>
                                                                {errors.esicCertificate && <ErrorMessage error={errors.esicCertificate} />}
                                                                {!otherDetails.esicCertificate ? (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={(e) => handleFileUpload(e, 'esicCertificate')}
                                                                            className="hidden"
                                                                            id="esic-certificate-upload"
                                                                        />
                                                                        <label htmlFor="esic-certificate-upload" className="cursor-pointer">
                                                                            <div className="flex flex-col items-center space-y-2">
                                                                                <Upload size={32} className="text-gray-400" />
                                                                                <p className="text-sm text-gray-600">
                                                                                    <span className="text-purple">Click to upload</span> or drag and drop
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">PDF (max. 5kb)</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="w-10 h-12 bg-red-500 rounded flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{otherDetails.esicCertificate.name}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(otherDetails.esicCertificate.size / (1024 * 1024)).toFixed(1)} MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOtherDetails(prev => ({ ...prev, esicCertificate: null }))}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* PT Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">PT details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment PT state
                                                                    </label>
                                                                    <InputBox
                                                                        type="select"
                                                                        placeholder="Select state"
                                                                        value={otherDetails.ptState}
                                                                        onChange={(e) => handleOtherDetailsChange('ptState', e)}
                                                                        options={[
                                                                            { value: 'karnataka', label: 'Karnataka' },
                                                                            { value: 'maharashtra', label: 'Maharashtra' },
                                                                            { value: 'tamil-nadu', label: 'Tamil Nadu' },
                                                                            { value: 'telangana', label: 'Telangana' }
                                                                        ]}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.ptState ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.ptState && <ErrorMessage error={errors.ptState} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment PT ID
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g., MH/1234567/000/0000001"
                                                                        value={otherDetails.ptId}
                                                                        onChange={(e) => handleOtherDetailsChange('ptId', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.ptId ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.ptId && <ErrorMessage error={errors.ptId} />}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Attach PT registration certificate
                                                                </label>
                                                                {errors.ptCertificate && <ErrorMessage error={errors.ptCertificate} />}
                                                                {!otherDetails.ptCertificate ? (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={(e) => handleFileUpload(e, 'ptCertificate')}
                                                                            className="hidden"
                                                                            id="pt-certificate-upload"
                                                                        />
                                                                        <label htmlFor="pt-certificate-upload" className="cursor-pointer">
                                                                            <div className="flex flex-col items-center space-y-2">
                                                                                <Upload size={32} className="text-gray-400" />
                                                                                <p className="text-sm text-gray-600">
                                                                                    <span className="text-purple">Click to upload</span> or drag and drop
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">PDF (max. 5kb)</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="w-10 h-12 bg-red-500 rounded flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{otherDetails.ptCertificate.name}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(otherDetails.ptCertificate.size / (1024 * 1024)).toFixed(1)} MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOtherDetails(prev => ({ ...prev, ptCertificate: null }))}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* LWF Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">LWF details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment LWF state
                                                                    </label>
                                                                    <InputBox
                                                                        type="select"
                                                                        placeholder="Select state"
                                                                        value={otherDetails.lwfState}
                                                                        onChange={(e) => handleOtherDetailsChange('lwfState', e)}
                                                                        options={[
                                                                            { value: 'karnataka', label: 'Karnataka' },
                                                                            { value: 'maharashtra', label: 'Maharashtra' },
                                                                            { value: 'tamil-nadu', label: 'Tamil Nadu' },
                                                                            { value: 'telangana', label: 'Telangana' }
                                                                        ]}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.lwfState ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.lwfState && <ErrorMessage error={errors.lwfState} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Vendor&apos;s establishment LWF ID
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g., MH/1234567/000/0000001"
                                                                        value={otherDetails.lwfId}
                                                                        onChange={(e) => handleOtherDetailsChange('lwfId', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.lwfId ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.lwfId && <ErrorMessage error={errors.lwfId} />}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Attach LWF registration certificate
                                                                </label>
                                                                {errors.lwfCertificate && <ErrorMessage error={errors.lwfCertificate} />}
                                                                {!otherDetails.lwfCertificate ? (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={(e) => handleFileUpload(e, 'lwfCertificate')}
                                                                            className="hidden"
                                                                            id="lwf-certificate-upload"
                                                                        />
                                                                        <label htmlFor="lwf-certificate-upload" className="cursor-pointer">
                                                                            <div className="flex flex-col items-center space-y-2">
                                                                                <Upload size={32} className="text-gray-400" />
                                                                                <p className="text-sm text-gray-600">
                                                                                    <span className="text-purple">Click to upload</span> or drag and drop
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">PDF (max. 5kb)</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="w-10 h-12 bg-red-500 rounded flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{otherDetails.lwfCertificate.name}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(otherDetails.lwfCertificate.size / (1024 * 1024)).toFixed(1)} MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOtherDetails(prev => ({ ...prev, lwfCertificate: null }))}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Other Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Other details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        PAN
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g., ABCDE1234F"
                                                                        value={otherDetails.pan}
                                                                        onChange={(e) => handleOtherDetailsChange('pan', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.pan ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.pan && <ErrorMessage error={errors.pan} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        TAN
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="E.g., ABCD12345E"
                                                                        value={otherDetails.tan}
                                                                        onChange={(e) => handleOtherDetailsChange('tan', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.tan ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.tan && <ErrorMessage error={errors.tan} />}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Bank Account Details */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Bank account details</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Account number
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter account number"
                                                                        value={otherDetails.accountNumber}
                                                                        onChange={(e) => handleOtherDetailsChange('accountNumber', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.accountNumber ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.accountNumber && <ErrorMessage error={errors.accountNumber} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Account holder&apos;s name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter account holder's name"
                                                                        value={otherDetails.accountHolderName}
                                                                        onChange={(e) => handleOtherDetailsChange('accountHolderName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.accountHolderName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.accountHolderName && <ErrorMessage error={errors.accountHolderName} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Bank name
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter bank name"
                                                                        value={otherDetails.bankName}
                                                                        onChange={(e) => handleOtherDetailsChange('bankName', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.bankName ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.bankName && <ErrorMessage error={errors.bankName} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        Branch
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter branch"
                                                                        value={otherDetails.bankBranch}
                                                                        onChange={(e) => handleOtherDetailsChange('bankBranch', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.bankBranch ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.bankBranch && <ErrorMessage error={errors.bankBranch} />}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                        IFSC
                                                                    </label>
                                                                    <InputBox
                                                                        type="text"
                                                                        placeholder="Enter IFSC"
                                                                        value={otherDetails.ifsc}
                                                                        onChange={(e) => handleOtherDetailsChange('ifsc', e)}
                                                                        variant="gray"
                                                                        className={`bg-white ${errors.ifsc ? 'border-red-500' : ''}`}
                                                                    />
                                                                    {errors.ifsc && <ErrorMessage error={errors.ifsc} />}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                    Attach cancelled cheque
                                                                </label>
                                                                {errors.cancelledCheque && <ErrorMessage error={errors.cancelledCheque} />}
                                                                {!otherDetails.cancelledCheque ? (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors bg-white">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                                            onChange={(e) => handleFileUpload(e, 'cancelledCheque')}
                                                                            className="hidden"
                                                                            id="cancelled-cheque-upload"
                                                                        />
                                                                        <label htmlFor="cancelled-cheque-upload" className="cursor-pointer">
                                                                            <div className="flex flex-col items-center space-y-2">
                                                                                <Upload size={32} className="text-gray-400" />
                                                                                <p className="text-sm text-gray-600">
                                                                                    <span className="text-purple">Click to upload</span> or drag and drop
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">PDF, JPG, PNG (max. 5kb)</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="w-10 h-12 bg-red-500 rounded flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">{otherDetails.cancelledCheque.name}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(otherDetails.cancelledCheque.size / (1024 * 1024)).toFixed(1)} MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOtherDetails(prev => ({ ...prev, cancelledCheque: null }))}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                                title="Remove file"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Vendor Stakeholders */}
                                                        <div className="mb-6 p-6 bg-[#F9FAFB] rounded-lg border border-gray-200">
                                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Vendor stakeholders</h4>
                                                            <div className="space-y-4">
                                                                {otherDetails.stakeholders.map((stakeholder, index) => (
                                                                    <div key={index} className="space-y-4">
                                                                        {otherDetails.stakeholders.length > 1 && (
                                                                            <div className="flex items-center justify-between">
                                                                                <h5 className="text-sm font-medium text-gray-800">Stakeholder {index + 1}</h5>
                                                                                <button
                                                                                    onClick={() => removeStakeholder(index)}
                                                                                    className="text-sm font-medium text-red-600 hover:text-red-800"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                    Name
                                                                                </label>
                                                                                <InputBox
                                                                                    type="text"
                                                                                    placeholder="Name of the stakeholder"
                                                                                    value={stakeholder.name}
                                                                                    onChange={(e) => handleStakeholderChange(index, 'name', e)}
                                                                                    variant="gray"
                                                                                    className={`bg-white ${errors[`stakeholder_${index}_name`] ? 'border-red-500' : ''}`}
                                                                                />
                                                                                {errors[`stakeholder_${index}_name`] && <ErrorMessage error={errors[`stakeholder_${index}_name`]} />}
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                    Designation
                                                                                </label>
                                                                                <InputBox
                                                                                    type="text"
                                                                                    placeholder="E.g., Project Manager"
                                                                                    value={stakeholder.designation}
                                                                                    onChange={(e) => handleStakeholderChange(index, 'designation', e)}
                                                                                    variant="gray"
                                                                                    className={`bg-white ${errors[`stakeholder_${index}_designation`] ? 'border-red-500' : ''}`}
                                                                                />
                                                                                {errors[`stakeholder_${index}_designation`] && <ErrorMessage error={errors[`stakeholder_${index}_designation`]} />}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[14px] font-[500] text-[#344054] mb-2">
                                                                                Email
                                                                            </label>
                                                                            <InputBox
                                                                                type="email"
                                                                                placeholder="E.g., stakeholder@company.com"
                                                                                value={stakeholder.email}
                                                                                onChange={(e) => handleStakeholderChange(index, 'email', e)}
                                                                                variant="gray"
                                                                                className={`bg-white ${errors[`stakeholder_${index}_email`] ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors[`stakeholder_${index}_email`] && <ErrorMessage error={errors[`stakeholder_${index}_email`]} />}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-4">
                                                                <button
                                                                    onClick={addStakeholder}
                                                                    className="flex items-center space-x-1 text-purple hover:text-purple-700 transition-colors border border-purple rounded-lg px-4 py-2 bg-white"
                                                                >
                                                                    <Plus size={16} />
                                                                    <span className="text-sm font-[600]">Add stakeholder</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-3 pt-6 mt-6 mb-16 border-t border-gray-200">
                                                        {/* <button
                                                            onClick={onClose}
                                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                                                        >
                                                            Cancel
                                                        </button> */}
                                                        <button
                                                            onClick={Otherdetailsavedandproceed}
                                                            className="px-6 py-2 bg-purple hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                        >
                                                            Save & proceed
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Footer */}

                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>

            {/* GSTIN Fetch Modal */}
            <GSTINFetchModal
                isOpen={isGSTINModalOpen}
                onClose={() => setIsGSTINModalOpen(false)}
                onFetchDetails={handleFetchGSTINDetails}
                onAutoFillDetails={handleAutoFillDetails}
            />
        </Transition>
    );
};

export default ManualVendorOnboardingModal;
