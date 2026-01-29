/**
 * AppShell Component
 * Layout wrapper สำหรับทุกหน้าที่ต้องการ Navbar
 */

import { Navbar } from './Navbar';

export const AppShell = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Navbar />
            {/* Add padding-top to prevent content from being hidden under fixed navbar */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                {children}
            </main>
        </div>
    );
};

export default AppShell;
