'use client'

import React, { useState } from 'react';
import { X, HelpCircle, Building2, MapPin } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface VendorDetails {
    companyName: string;
    gstnStatus: string;
    address: string[];
    taxpayerType: string;
    businessTradeName: string;
    gstin?: string;
}

interface GSTINFetchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFetchDetails: (gstin: string) => void;
    onAutoFillDetails: (details: VendorDetails) => void;
}

const GSTINFetchModal: React.FC<GSTINFetchModalProps> = ({
    isOpen,
    onClose,
    onFetchDetails,
    onAutoFillDetails
}) => {
    const [gstin, setGstin] = useState('37AAMCM5291Q1ZH');
    const [fetchedDetails, setFetchedDetails] = useState<VendorDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Debug log to track state changes
    React.useEffect(() => {
        console.log('Fetched details state changed:', fetchedDetails);
    }, [fetchedDetails]);

    const handleFetchDetails = async () => {
        if (gstin.trim()) {
            setIsLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                // Mock data based on the design
                const mockDetails: VendorDetails = {
                    companyName: "Buzzworks bussiness services Pvt. Ltd.",
                    gstnStatus: "Active",
                    address: [
                        "Buzzworks business services",
                        "No.85, 3rd Floor, Naicker Building,",
                        "Greams Road, Thousand Lights.",
                        "Chennai, Tamil Nadu, India -600006"
                    ],
                    taxpayerType: "Regular",
                    businessTradeName: "Buzzworks Bussiness Services"
                };
                setFetchedDetails(mockDetails);
                setIsLoading(false);
                console.log('Fetched details set:', mockDetails);
            }, 1000);
        }
    };

    const handleAutoFillDetails = () => {
        if (fetchedDetails) {
            onAutoFillDetails({
                ...fetchedDetails,
                gstin: gstin
            });
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFetchDetails();
        }
    };

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-[#7F56D9] px-6 py-4 flex justify-between items-center">
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                                        Fetch details from GSTIN
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GSTIN
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={gstin}
                                                    onChange={(e) => setGstin(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Eg.29ABCDE1234F2Z3"
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <HelpCircle size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleFetchDetails}
                                                disabled={!gstin.trim() || isLoading}
                                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${gstin.trim() && !isLoading
                                                    ? 'bg-[#7F56D9] hover:bg-purple-700 text-white'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {isLoading ? 'Fetching...' : 'Fetch details'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Vendor Details Card */}
                                    {fetchedDetails && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Vendor details</h4>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 relative overflow-hidden">
                                                {/* Background Pattern */}
                                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                                                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                                                        <Building2 size={24} className="text-purple-600" />
                                                    </div>
                                                </div>

                                                <div className="mt-8 space-y-4">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 text-lg">
                                                            {fetchedDetails.companyName}
                                                        </h5>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">GSTN status:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-sm font-medium text-green-700">
                                                                {fetchedDetails.gstnStatus}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-start space-x-2 mb-2">
                                                            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-600">Available address:</span>
                                                        </div>
                                                        <div className="ml-6 space-y-1">
                                                            {fetchedDetails.address.map((line, index) => (
                                                                <div key={index} className="text-sm text-gray-700">
                                                                    {line}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-sm text-gray-600">Tax payer type:</span>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {fetchedDetails.taxpayerType}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-600">Business trade name:</span>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {fetchedDetails.businessTradeName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    {fetchedDetails && (
                                        <button
                                            onClick={handleAutoFillDetails}
                                            className="px-6 py-2 bg-[#7F56D9] hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Auto-fill details
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GSTINFetchModal;
