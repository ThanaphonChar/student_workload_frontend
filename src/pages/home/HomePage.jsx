import { useAuth } from '../../hooks/useAuth';
import { AppShell } from '../../components/layout/AppShell';

export const HomePage = () => {
    const { user } = useAuth();

    const roleLabelMap = {
        'Student': 'นักศึกษา',
        'Program Chair': 'ประธานหลักสูตร',
        'Professor': 'อาจารย์',
        'Academic Officer': 'เจ้าหน้าที่วิชาการ',
    };

    const displayRoles = Array.isArray(user?.roles)
        ? user.roles.map((role) => roleLabelMap[role] || role).join(', ')
        : '-';

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        ยินดีต้อนรับ
                    </h1>
                    <p className="text-2xl text-gray-700">
                        คุณ {user?.displayname_th || user?.displayname_en || user?.username}
                    </p>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ข้อมูลผู้ใช้
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-600">ประเภทผู้ใช้</p>
                            <p className="text-xl font-medium text-gray-900">
                                {user?.type === 'student' ? 'นักศึกษา' : 'บุคลากร'}
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-600">ชื่อผู้ใช้</p>
                            <p className="text-xl font-medium text-gray-900">
                                {user?.username}
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-600">อีเมล</p>
                            <p className="text-xl font-medium text-gray-900">
                                {user?.email || '-'}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-2xl font-bold text-gray-600">บทบาท</p>
                            <p className="text-xl font-medium text-gray-900">
                                {displayRoles}
                            </p>
                        </div>
                        {user?.type === 'student' ? (
                            <>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">คณะ</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.faculty || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">สาขา</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.department || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">สถานะ</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.tu_status || '-'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">หน่วยงาน</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.organization || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">แผนก</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.department || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-600">สถานะการทำงาน</p>
                                    <p className="text-xl font-medium text-gray-900">
                                        {user?.StatusEmp || '-'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>


            </div>
        </AppShell>
    );
};
