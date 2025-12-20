/**
 * UnauthorizedPage Component
 * หน้าแสดงเมื่อผู้ใช้พยายามเข้าถึง route ที่ไม่มีสิทธิ์
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const { user, roles } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
                    <svg
                        className="h-12 w-12 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        ไม่มีสิทธิ์เข้าถึง
                    </h2>
                    <p className="text-gray-600 mb-4">
                        คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
                    </p>
                    {roles && roles.length > 0 && (
                        <p className="text-sm text-gray-500">
                            บทบาทปัจจุบัน: <span className="font-semibold">{roles.join(', ')}</span>
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        กลับหน้าหลัก
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 mt-4">
                    หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ
                </p>
            </div>
        </div>
    );
};
