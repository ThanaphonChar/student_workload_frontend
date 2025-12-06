/**
 * Navbar Component
 * Navigation bar สำหรับส่วน authenticated
 */

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / App Name */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-blue-600">
                            Student Workload
                        </h1>
                    </div>

                    {/* User Info & Logout */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-700">
                                {user?.displayname_th || user?.displayname_en || user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.type === 'student' ? 'นักศึกษา' : 'บุคลากร'}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="text-sm"
                        >
                            ออกจากระบบ
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
