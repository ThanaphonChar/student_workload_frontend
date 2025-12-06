/**
 * Font Test Component
 * ทดสอบการแสดงผล KhwanThong-Card Font
 */

export const FontTestPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ทดสอบ Font KhwanThong-Card
                    </h1>
                    <p className="text-gray-600">
                        หน้านี้ใช้สำหรับทดสอบการแสดงผลของ Font KhwanThong-Card ในน้ำหนักและสไตล์ต่างๆ
                    </p>
                </div>

                {/* Font Weights */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        น้ำหนักฟอนต์ (Font Weights)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Light (300)</p>
                            <p className="text-xl font-light">
                                มหาวิทยาลัยธรรมศาสตร์ - Thammasat University
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Regular (400) - Default</p>
                            <p className="text-xl font-normal">
                                มหาวิทยาลัยธรรมศาสตร์ - Thammasat University
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Bold (700)</p>
                            <p className="text-xl font-bold">
                                มหาวิทยาลัยธรรมศาสตร์ - Thammasat University
                            </p>
                        </div>
                    </div>
                </div>

                {/* Font Styles */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        สไตล์ฟอนต์ (Font Styles)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Normal</p>
                            <p className="text-xl">
                                ระบบจัดการภาระงานนักศึกษา Student Workload Management System
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Italic</p>
                            <p className="text-xl italic">
                                ระบบจัดการภาระงานนักศึกษา Student Workload Management System
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Bold Italic</p>
                            <p className="text-xl font-bold italic">
                                ระบบจัดการภาระงานนักศึกษา Student Workload Management System
                            </p>
                        </div>
                    </div>
                </div>

                {/* Text Sizes */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        ขนาดตัวอักษร (Text Sizes)
                    </h2>

                    <div className="space-y-3">
                        <p className="text-xs">ขนาด XS - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-sm">ขนาด SM - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-base">ขนาด Base - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-lg">ขนาด LG - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-xl">ขนาด XL - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-2xl">ขนาด 2XL - นักศึกษาและการจัดการภาระงาน</p>
                        <p className="text-3xl">ขนาด 3XL - นักศึกษาและการจัดการภาระงาน</p>
                    </div>
                </div>

                {/* Sample Content */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        ตัวอย่างเนื้อหา
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <p className="leading-relaxed">
                            ระบบจัดการภาระงานนักศึกษา (Student Workload Management System)
                            เป็นระบบที่พัฒนาขึ้นเพื่อช่วยในการติดตามและจัดการภาระงานของนักศึกษา
                            ให้มีประสิทธิภาพมากยิ่งขึ้น
                        </p>
                        <p className="leading-relaxed">
                            <strong>คุณสมบัติหลัก:</strong> ระบบสามารถแสดงรายละเอียดของงาน
                            ติดตามความคืบหน้า และสร้างรายงานสรุปได้อย่างครบถ้วน
                        </p>
                        <p className="leading-relaxed italic">
                            Font นี้รองรับทั้งภาษาไทยและภาษาอังกฤษ พร้อมตัวเลข 0123456789
                            และอักขระพิเศษต่างๆ !@#$%^&*()
                        </p>
                    </div>
                </div>

                {/* Technical Info */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                        ข้อมูลทางเทคนิค
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✅ Font Family: KhwanThongCard</li>
                        <li>✅ Weights: Light (300), Regular (400), Bold (700)</li>
                        <li>✅ Styles: Normal, Italic</li>
                        <li>✅ Default: KhwanThong-Card-Regular.ttf</li>
                        <li>✅ Tailwind: font-sans, font-khwanthong</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
