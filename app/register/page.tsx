'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        hospital_at: '',
        first_name: '',
        last_name: '',
        role: '',
        gender: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('❌ กรุณาตรวจสอบรหัสผ่านให้ตรงกันทั้งสองช่อง');
            setIsLoading(false);
            return;
        }

        try {
            const registrationData = {
                username: formData.username,
                password: formData.password,
                hospital_at: formData.hospital_at,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role,
                gender: formData.gender,
                created_date: new Date().toISOString().split('T')[0],
                created_time: new Date().toTimeString().split(' ')[0],
                status: 'active'
            };

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            // Registration successful
            alert('ลงทะเบียนสำเร็จ');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        สร้างบัญชีผู้ใช้
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center text-sm font-medium flex items-center justify-center space-x-2">
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="ชื่อผู้ใช้"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="first_name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="ชื่อจริง"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="last_name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="นามสกุล"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <select
                                name="hospital_at"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.hospital_at}
                                onChange={handleChange}
                            >
                                <option value="">กรุณาเลือกโรงพยาบาล</option>
                                <option value="โรงพยาบาลบางปะกอก 9 อินเตอร์เนชั่นแนล">โรงพยาบาลบางปะกอก 9 อินเตอร์เนชั่นแนล</option>
                                <option value="โรงพยาบาลบางปะกอก 1">โรงพยาบาลบางปะกอก 1</option>
                                <option value="โรงพยาบาลบางปะกอก 3">โรงพยาบาลบางปะกอก 3</option>
                                <option value="โรงพยาบาลบางปะกอก 8">โรงพยาบาลบางปะกอก 8</option>
                                <option value="โรงพยาบาลบางปะกอก 2 รังสิต">โรงพยาบาลบางปะกอก 2 รังสิต</option>
                                <option value="โรงพยาบาลบางปะกอกสมุทรปราการ">โรงพยาบาลบางปะกอกสมุทรปราการ</option>
                                <option value="โรงพยาบาลปิยะเวท">โรงพยาบาลปิยะเวท</option>
                                <option value="โรงพยาบาลบางปะกอกอายุรเวช">โรงพยาบาลบางปะกอกอายุรเวช</option>
                            </select>
                        </div>
                        <div>
                            <select
                                name="role"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="">กรุณาเลือกบทบาท</option>
                                <option value="doctor">แพทย์</option>
                                <option value="nurse">พยาบาล</option>
                                <option value="staff">เจ้าหน้าที่</option>
                            </select>
                        </div>
                        <div>
                            <select
                                name="gender"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">กรุณาเลือกเพศ</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="รหัสผ่าน"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="ยืนยันรหัสผ่าน"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : 'ลงทะเบียน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
