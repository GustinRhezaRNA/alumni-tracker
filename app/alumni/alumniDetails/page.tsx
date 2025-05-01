/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { alumniFields } from "@/constants/roles";
import LoadingSpinner from '@/components/LoadingSpinner';

const AlumniDetails = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);  // State for profile data
    const [formData, setFormData] = useState<any>({});  // Form state
    const [loading, setLoading] = useState(true);  // Loading state

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/');  // Redirect to login page if user is not logged in
            return;
        }

        // Fetch the profile data
        const getAlumniProfile = async (userEmail: string) => {
            const response = await fetch('/api/alumniProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            });

            const data = await response.json();
            setProfileData(data);
            setLoading(false);
        };

        getAlumniProfile(session.user?.email as string);
    }, [session, status, router]);

    // Set form data once profileData is fetched
    useEffect(() => {
        if (profileData) {
            setFormData({
                nim: profileData.nim,
                graduationYear: profileData.graduationYear,
                faculty: profileData.faculty,
                major: profileData.major,
                phone: profileData.phone,
                address: profileData.address,
                jobStatus: profileData.jobStatus,
                currentCompany: profileData.currentCompany || "",
                jobPosition: profileData.jobPosition || "",
                jobWaitTime: profileData.jobWaitTime || "",
                firstSalary: profileData.firstSalary || "",
                jobMatchWithMajor: profileData.jobMatchWithMajor || "",
                curriculumFeedback: profileData.curriculumFeedback || "",
                universityName: profileData.universityName,
                studyProgram: profileData.studyProgram,
                fundingSource: profileData.fundingSource,
                scholarshipSource: profileData.scholarshipSource,
            });
        }
    }, [profileData]);

    // Handle input change for form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle select field change
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to update profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = { userEmail: session?.user?.email, ...formData };
        console.log('Form submitted:', submitData);

        const response = await fetch('/api/alumniProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');
            router.push('/alumni');
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    };

    // Log formData for debugging purposes
    console.log(formData);

    if (loading) return <LoadingSpinner />;

    return (
        <form id='alumniProfile' className='bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12'>
            <Card className='w-[80vw] max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6'>
                <h1 className='text-3xl font-semibold text-[#333]'>Alumni Profile</h1>

                {alumniFields.map((field) => {
                    // Debugging: Check field condition
                    console.log(`Checking condition for ${field.fieldName}:`, formData[field.condition]);

                    // Check if condition is met for this field
                    if (field.condition && formData[field.condition] !== field.condition) {
                        console.log(`Skipping field ${field.fieldName} because condition is not met`);
                        return null; // Skip rendering if condition is not met
                    }

                    return (
                        <div key={field.fieldName} className="mt-4">
                            <label htmlFor={field.fieldName} className="block text-sm font-medium text-gray-600">{field.label}:</label>
                            {field.type === "select" ? (
                                <select
                                    name={field.fieldName}
                                    value={formData[field.fieldName] || ""}
                                    onChange={(e) => handleSelectChange(field.fieldName, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {field.options?.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    type={field.type || "text"}
                                    name={field.fieldName}
                                    value={formData[field.fieldName] || ""}
                                    onChange={handleInputChange}
                                    placeholder={field.placeholder || ""}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    );
                })}

                <div className="flex gap-4 justify-end mt-4">
                    <Button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-600 text-white'>
                        Save Changes
                    </Button>
                </div>
            </Card>
        </form>
    );
};

export default AlumniDetails;
