/**
 * Navbar Component
 * แถบเมนูด้านบนของระบบ
 * รองรับการกรอง menu items ตาม role ของผู้ใช้
 */

import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getFilteredMenu } from '../../config/roleConfig';
import sci_logo from '../../assets/sci_logo.svg';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, roles, logout } = useAuth();

    // กรอง menu items ตาม roles ของผู้ใช้
    // ส่ง roles ทั้งหมดไปเพื่อให้ menu แสดงตาม roles ที่มี
    const menuItems = useMemo(() => {
        return getFilteredMenu(roles);
    }, [roles]);

    // ตรวจสอบว่าเมนูไหน active
    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo & Menu */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img src={sci_logo} alt="SCITU" className="h-16" />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-6">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`px-3 py-2 text-xl font-medium transition-colors relative ${isActive(item.path)
                                        ? 'text-[#050C9C]'
                                        : 'text-gray-600 hover:text-[#050C9C]'
                                        }`}
                                >
                                    {item.label}
                                    {isActive(item.path) && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#050C9C]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Notifications & User */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900">
                            <span className="material-symbols-outlined">
                                notifications
                            </span>
                            {/* Badge */}
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User Avatar & Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                                <div className="w-8 h-8 bg-[#050C9C] rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.displayname_th?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                </div>
                                <span className="hidden md:block text-xl text-gray-700">
                                    {user?.displayname_th || user?.username}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="block w-full text-left px-4 py-2 text-xl text-gray-700 hover:bg-gray-100"
                                >
                                    โปรไฟล์
                                </button>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="block w-full text-left px-4 py-2 text-xl text-gray-700 hover:bg-gray-100"
                                >
                                    ตั้งค่า
                                </button>
                                <hr className="my-2" />
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-xl text-red-600 hover:bg-gray-100"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`block w-full text-left px-3 py-2 text-xl font-medium rounded-md ${isActive(item.path)
                                ? 'bg-[#050C9C] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};
