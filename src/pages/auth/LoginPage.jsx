/**
 * LoginPage Component
 * หน้า Login สำหรับ authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { TextInput } from '../../components/common/TextInput';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, authError } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error เมื่อ user เริ่มพิมพ์
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login(formData.username, formData.password);
            // Login สำเร็จ - navigate ไป dashboard
            navigate('/dashboard');
        } catch (error) {
            // Error จะแสดงผ่าน authError จาก context
            console.error('Login failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-gray-600">
                            Student Workload Management System
                        </p>
                    </div>

                    {/* Error Alert */}
                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 text-center">
                                {authError}
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextInput
                            label="ชื่อผู้ใช้"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="รหัสนักศึกษา หรือ Username"
                            required
                            error={errors.username}
                            autoComplete="username"
                        />

                        <TextInput
                            label="รหัสผ่าน"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="รหัสผ่าน"
                            required
                            error={errors.password}
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-6"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner size="small" />
                                    <span className="ml-2">กำลังเข้าสู่ระบบ...</span>
                                </span>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ใช้ชื่อผู้ใช้และรหัสผ่านของมหาวิทยาลัยธรรมศาสตร์
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อ IT Support
                    </p>
                </div>
            </div>
        </div>
    );
};
