'use client'

import AppLayout from '@/components/AppLayout'
import CustomDatePicker from '@/common/CustomDatePicker'
import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import IndiaMap from '@/assets/svg/IndiaMap'

const VendorInsightsPage = () => {
    const [selectedDate, setSelectedDate] = useState('')
    const vendorLocations = [
        { id: '1', name: 'Mumbai Hub', state: 'Maharashtra', city: 'Mumbai', vendorCount: 12, coordinates: { x: 35, y: 70 } },
        { id: '2', name: 'Delhi Center', state: 'Delhi', city: 'New Delhi', vendorCount: 8, coordinates: { x: 50, y: 25 } },
        { id: '3', name: 'Bangalore Office', state: 'Karnataka', city: 'Bangalore', vendorCount: 15, coordinates: { x: 55, y: 80 } },
        { id: '4', name: 'Chennai Branch', state: 'Tamil Nadu', city: 'Chennai', vendorCount: 6, coordinates: { x: 60, y: 85 } },
        { id: '5', name: 'Kolkata Unit', state: 'West Bengal', city: 'Kolkata', vendorCount: 4, coordinates: { x: 70, y: 45 } },
    ]

    // Sample data for the bar chart - matching the image
    const vendorData = [
        { month: 'Jan', count: 3 },
        { month: 'Feb', count: 22 },
        { month: 'Mar', count: 15 },
        { month: 'Apr', count: 20 },
        { month: 'May', count: 15 },
        { month: 'Jan', count: 22 }
    ]

    const maxCount = Math.max(...vendorData.map(d => d.count))

    return (
        <AppLayout title='Vendor management'>
            <div className=" px-3 sm:px-4 lg:px-6">
                {/* Header with title and date picker */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-[18px] font-[600] text-[#344054]">Insights</h1>
                    <div className="w-full sm:w-64">
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder="Select date range"
                        />
                    </div>
                </div>

                {/* Main dashboard content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Insights Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                        <div className="mb-4 sm:mb-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">Active vendors (Month-on-Month)</h3>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">100 vendors</div>
                            </div>
                            <div>
                                <div className="text-xs sm:text-sm text-gray-600 mb-2">↑ Vendor count → Month</div>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="space-y-3 sm:space-y-4">

                            {/* Chart Container with Axes */}
                            <div className="relative">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 h-32 sm:h-40 lg:h-48 flex flex-col justify-between text-xs text-gray-400 pr-2">
                                    <span>50</span>
                                    <span>40</span>
                                    <span>30</span>
                                    <span>20</span>
                                    <span>10</span>
                                    <span>0</span>
                                </div>

                                {/* Chart area */}
                                <div className="ml-8 sm:ml-10 lg:ml-12">
                                    {/* Grid lines - dotted style */}
                                    <div className="absolute inset-0 ml-8 sm:ml-10 lg:ml-12 h-32 sm:h-40 lg:h-48">
                                        {[0, 10, 20, 30, 40, 50].map((value) => (
                                            <div
                                                key={value}
                                                className="absolute w-full border-t border-dotted border-gray-200"
                                                style={{ bottom: `${(value / 50) * 100}%` }}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* Bars */}
                                    <div className="flex items-end justify-between h-32 sm:h-40 lg:h-48 px-1 sm:px-2 relative z-10">
                                        {vendorData.map((data, index) => (
                                            <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="bg-purple rounded-t w-4 sm:w-6 lg:w-8 transition-all duration-300 hover:bg-purple-700"
                                                        style={{ height: `${(data.count / 50) * 100}px` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{data.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vendors Distribution Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Vendors distribution</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="flex justify-center sm:justify-start flex-shrink-0">
                                <IndiaMap
                                    width={200}
                                    height={200}
                                    className="text-gray-200 sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px]"
                                />
                            </div>
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <div className="text-[#667085] text-base sm:text-lg lg:text-xl xl:text-[28px] font-[400] leading-relaxed break-words">
                                    There are <br /> <span className="text-gray-800 font-semibold">60</span> active <br />vendors <br /> spread <br /> across <br /><span className="text-gray-800 font-semibold">8 states</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default VendorInsightsPage