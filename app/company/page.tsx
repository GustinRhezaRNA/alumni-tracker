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

const Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [companyData, setCompanyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //tidak mendapatkan parsing session disini jadi terpental ke '/'
        if (status === 'loading') return; // Menunggu session selesai dimuat
        if (!session) {
            router.push('/');  // Redirect to login page if user is not logged in
            return;
        }
    
        // Fetch the company profile data
        const getCompanyProfile = async (userEmail: string) => {
            const response = await fetch('/api/companyProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            });
    
            const data = await response.json();
            setCompanyData(data);
            setLoading(false);
        };
    
        if (session?.user?.email) {
            getCompanyProfile(session.user.email);
        }
    
    }, [session, status, router]);
    

    if (status === "loading" || loading) {
        return <LoadingSpinner />;
    }

    const handleEditClick = () => {
        router.push('/company/companyDetails'); 
    };

    const handleSeeReview = () => {
        router.push('/company/reviewed'); 
    };

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    const handleSearchClick = () => {
        router.push('/company/search'); 
    };

    return (
        <div id='profileAlumni' className='bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12'>
            {/* Card for Profile Information */}
            <Card className='min-w-8/12 max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6'>
                <div className="flex items-center">
                    {/* Profile Image */}
                    <Image src={session?.user?.image || '/Blank-PP.png'} alt='Profile Image' width={100} height={100} className='rounded-full' />
                    <div className="ml-6">
                        <h1 className='text-3xl font-semibold text-[#333]'>Hi, {session?.user?.name}</h1>
                        <p className='text-slate-500'>{session?.user?.email}</p>
                    </div>
                </div>

                {/* Company Profile */}
                <div className="mt-6">
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-600">Industry</label>
                    <Input id="industry" type="text" value={companyData?.industry || ''} disabled />
                </div>

                <div className="mt-4">
                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-600">Company Description</label>
                    <Input id="companyDescription" type="text" value={companyData?.companyDescription || ''} disabled />
                </div>

                <div className="mt-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                    <Input id="address" type="text" value={companyData?.address || ''} disabled />
                </div>

                <div className="mt-4">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-600">Contact</label>
                    <Input id="contact" type="text" value={companyData?.contact || ''} disabled />
                </div>

                <div className="mt-4">
                    <label htmlFor="hrdContact" className="block text-sm font-medium text-gray-600">HRD Contact</label>
                    <Input id="hrdContact" type="text" value={companyData?.hrdContact || ''} disabled />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end mt-6">
                    <Button onClick={handleEditClick} className='bg-blue-500 hover:bg-blue-600 text-white'>Edit Data</Button>
                    <Button onClick={handleSearchClick} className='bg-yellow-500 hover:bg-yellow-600 text-white'>Search Alumni</Button>
                    <Button onClick={handleSeeReview} className='bg-green-500 hover:bg-green-600 text-white'>See Review</Button>
                    <Button onClick={handleSignOut} className='bg-red-500 hover:bg-red-600 text-white'>Logout</Button>
                </div>
            </Card>
        </div>
    );
}

export default Page;
