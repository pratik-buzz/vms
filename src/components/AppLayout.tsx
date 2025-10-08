'use client'

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed position on desktop */}
            <div className={`fixed left-0 top-0 z-50 lg:fixed lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            </div>

            {/* Main content - with left margin to account for fixed sidebar */}
            <div className={`flex-1 w-full flex flex-col transition-all duration-300 ease-in-out ml-0 ${isSidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[255px]'
                }`}>
                <TopNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    {title && (
                        <div className="p-6 pb-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
