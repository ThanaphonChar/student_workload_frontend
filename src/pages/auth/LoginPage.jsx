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
import sci_logo from '../../assets/sci_logo.svg';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, authError } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            // Login สำเร็จ - navigate ไป home
            navigate('/home');
        } catch (error) {
            // Error จะแสดงผ่าน authError จาก context
            console.error('Login failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4">
            <div className="max-w-xl w-full">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 px-32">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-[36px] font-bold text-gray-900 mb-6">
                            เข้าสู่ระบบ
                        </h1>
                    </div>

                    {/* Error Alert */}
                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-[16px] text-red-800 text-center">
                                {authError}
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 text-[20px] text-[#818181]">
                        <TextInput
                            label="เลขทะเบียนนักศึกษา / รหัสผู้ใช้"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="รหัสนักศึกษา หรือ Username"
                            required
                            error={errors.username}
                            autoComplete="username"
                        />

                        <div className="relative">
                            <TextInput
                                label="รหัสผ่าน"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="รหัสผ่าน"
                                required
                                error={errors.password}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[47px] text-gray-400 hover:text-gray-500 focus:outline-none"
                                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-6 bg-[#050C9C] text-white text-[20px]"
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
                        <div className="flex justify-center mt-6">
                            <img src={sci_logo} alt="SCITU" className="h-18" />
                        </div>
                    </form>


                </div>

            </div>
        </div>
    );
};
