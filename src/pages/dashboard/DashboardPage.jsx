/**
 * DashboardPage Component
 * หน้า Dashboard หลังจาก login สำเร็จ
 */

import { useAuth } from '../../hooks/useAuth';
import { AppShell } from '../../components/layout/AppShell';

export const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ยินดีต้อนรับ
                    </h1>
                    <p className="text-xl text-gray-700">
                        {user?.displayname_th || user?.displayname_en || user?.username}
                    </p>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        ข้อมูลผู้ใช้
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">ประเภทผู้ใช้</p>
                            <p className="text-lg font-medium text-gray-900">
                                {user?.type === 'student' ? 'นักศึกษา' : 'บุคลากร'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">ชื่อผู้ใช้</p>
                            <p className="text-lg font-medium text-gray-900">
                                {user?.username}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">อีเมล</p>
                            <p className="text-lg font-medium text-gray-900">
                                {user?.email || '-'}
                            </p>
                        </div>
                        {user?.type === 'student' ? (
                            <>
                                <div>
                                    <p className="text-sm text-gray-600">คณะ</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.faculty || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">สาขา</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.department || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">สถานะ</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.tu_status || '-'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-gray-600">หน่วยงาน</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.organization || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">แผนก</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.department || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">สถานะการทำงาน</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.StatusEmp || '-'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Placeholder for future features */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        ฟีเจอร์ที่กำลังจะมา
                    </h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                            <span className="mr-2">📊</span>
                            รายงานภาระงานของนักศึกษา
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📅</span>
                            ตารางงานและกิจกรรม
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📈</span>
                            สถิติและการวิเคราะห์
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">⚙️</span>
                            การตั้งค่าบัญชี
                        </li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
};
