'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import AverageRatingsByMajor from './_components/AverageRatingsByMajor'

const Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>({
        nim: '',
        graduationYear: '',
        major: '',
        phone: '',
        address: '',
        jobStatus: '',
        currentCompany: '',
        jobPosition: '',
        jobWaitTime: '',
        firstSalary: '',
        jobMatchWithMajor: 0,
        curriculumFeedback: '',
        universityName: '',
        studyProgram: '',
        fundingSource: '',
        scholarshipSource: '',
    });

    const [loading, setLoading] = useState(true);

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
            console.log(data);
            setProfileData({
                nim: data.nim || '',
                graduationYear: data.graduationYear || '',
                major: data.major || '',
                phone: data.phone || '',
                address: data.address || '',
                jobStatus: data.jobStatus || '',
                currentCompany: data.currentCompany || '',
                jobPosition: data.jobPosition || '',
                jobWaitTime: data.jobWaitTime || '',
                firstSalary: data.firstSalary || '',
                jobMatchWithMajor: data.jobMatchWithMajor ?? 0,
                curriculumFeedback: data.curriculumFeedback || '',
                universityName: data.universityName || '',
                studyProgram: data.studyProgram || '',
                fundingSource: data.fundingSource || '',
                scholarshipSource: data.scholarshipSource || '',
            });

            setLoading(false);
        };

        getAlumniProfile(session.user?.email as string);
    }, [session, status, router]);

    if (status === "loading" || loading) {
        return <LoadingSpinner />;
    }

    const handleEditClick = () => {
        router.push('/alumni/alumniDetails');
    };

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <div id='profileAlumni' className='bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12'>
            {/* Card for Profile Information */}
            <Card className='min-w-3/4 max-w-3xl min-h-[600px] p-6 bg-white rounded-2xl shadow-md mb-6'>
                <div className="flex items-end">
                    {/* Profile Image */}
                    <Image src={session?.user?.image || '/Blank-PP.png'} alt='Profile Image' width={200} height={200} className='rounded-3xl' />
                    <div className="ml-6">
                        <h1 className='text-4xl font-semibold text-[#333]'>Hi, {session?.user?.name}</h1>
                        <p className='text-2xl text-slate-500'>{session?.user?.email}</p>
                    </div>
                </div>

                {/* Form Inputs */}
                {profileData.nim && (
                    <div className="">
                        <label htmlFor="nim" className="block text-sm font-medium text-gray-600">NIM</label>
                        <Input id="nim" type="text" disabled value={profileData.nim} />
                    </div>
                )}

                {profileData.jobStatus && (
                    <div className="">
                        <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-600">Job Status</label>
                        <Input id="jobStatus" type="text" disabled value={profileData.jobStatus} />
                    </div>
                )}

                {profileData.graduationYear && (
                    <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-600">Graduation Year</label>
                        <Input id="graduationYear" type="text" disabled value={profileData.graduationYear} />
                    </div>
                )}

                {profileData.major && (
                    <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-600">Major</label>
                        <Input id="major" type="text" disabled value={profileData.major} />
                    </div>
                )}

                {profileData.phone && (
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone</label>
                        <Input id="phone" type="text" disabled value={profileData.phone} />
                    </div>
                )}

                {profileData.address && (
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                        <Input id="address" type="text" disabled value={profileData.address} />
                    </div>
                )}

                {profileData.universityName && (
                    <div>
                        <label htmlFor="universityName" className="block text-sm font-medium text-gray-600">University Name</label>
                        <Input id="universityName" type="text" disabled value={profileData.universityName} />
                    </div>
                )}

                {profileData.studyProgram && (
                    <div>
                        <label htmlFor="studyProgram" className="block text-sm font-medium text-gray-600">Study Program</label>
                        <Input id="studyProgram" type="text" disabled value={profileData.studyProgram} />
                    </div>
                )}

                {profileData.fundingSource && (
                    <div>
                        <label htmlFor="fundingSource" className="block text-sm font-medium text-gray-600">Funding Source</label>
                        <Input id="fundingSource" type="text" disabled value={profileData.fundingSource} />
                    </div>
                )}

                {profileData.scholarshipSource && (
                    <div>
                        <label htmlFor="scholarshipSource" className="block text-sm font-medium text-gray-600">Scholarship Source</label>
                        <Input id="scholarshipSource" type="text" disabled value={profileData.scholarshipSource} />
                    </div>
                )}


                {profileData.currentCompany && (
                    <div className="">
                        <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-600">Current Company</label>
                        <Input id="currentCompany" type="text" disabled value={profileData.currentCompany} />
                    </div>
                )}

                {profileData.jobPosition && (
                    <div className="">
                        <label htmlFor="jobPosition" className="block text-sm font-medium text-gray-600">Job Position</label>
                        <Input id="jobPosition" type="text" disabled value={profileData.jobPosition} />
                    </div>
                )}

                {profileData.jobWaitTime && (
                    <div className="">
                        <label htmlFor="jobWaitTime" className="block text-sm font-medium text-gray-600">Job Wait Time</label>
                        <Input id="jobWaitTime" type="text" disabled value={profileData.jobWaitTime} />
                    </div>
                )}

                {profileData.firstSalary && (
                    <div className="">
                        <label htmlFor="firstSalary" className="block text-sm font-medium text-gray-600">First Salary</label>
                        <Input id="firstSalary" type="text" disabled value={profileData.firstSalary} />
                    </div>
                )}

                {profileData.curriculumFeedback && (
                    <div className="">
                        <label htmlFor="curriculumFeedback" className="block text-sm font-medium text-gray-600">Curriculum Feedback</label>
                        <Input id="curriculumFeedback" type="text" disabled value={profileData.curriculumFeedback} />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 justify-end mt-6">
                    <Button onClick={handleEditClick} className='bg-yellow-500 hover:bg-yellow-600 text-white'>Edit Data</Button>
                    <Button onClick={handleSignOut} className='bg-red-500 hover:bg-red-600 text-white'>Logout</Button>
                </div>
            </Card>

            {/* <div className="flex gap-4 w-full min-w-3/4 max-w-3xl">
                <Card className='w-full p-4'>
                    <h2 className='text-2xl font-semibold text-[#333]'>Average Ratings by Major</h2>
                    <p className='text-slate-500'>This section shows the average ratings of alumni based on their major.</p>
                    <AverageRatingsByMajor />
                </Card>
               
            </div> */}
        </div>
    );
}

export default Page;
