import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background-dark text-text-main dark:text-text-mainDark font-sans">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
