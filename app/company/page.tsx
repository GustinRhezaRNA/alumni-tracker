'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import BarChart from '@/components/BarChart'

// Extend the User type to include the role property
declare module 'next-auth' {
    interface User {
        role?: string;
    }
    interface Session {
        user?: User;
    }
}

const Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
          router.push('/')
        }
      
    }, [status, session, router]);

    if (status === "loading") {
        return <LoadingSpinner/>;

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
        router.push('/company/search'); // Redirect to the search page
    }


    return (
        <div id='profileAlumni' className='bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12'>
            {/* Card for Profile Information */}
            <Card className='min-w-8/12 max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6'>
                <div className="flex items-center ">
                    {/* Profile Image */}
                    <Image src={session?.user?.image || '/Blank-PP.png'} alt='Profile Image' width={100} height={100} className='rounded-full' />
                    <div className="ml-6">
                        <h1 className='text-3xl font-semibold text-[#333]'>Hi, {session?.user?.name}</h1>
                        <p className='text-slate-500'>{session?.user?.email}</p>

                    </div>
                </div>

                {/* Form Inputs */}
                <div className=""> 
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-600">Industry</label>
                    <Input id="industry" type="text" disabled placeholder='Manufacture' />
                </div>          

                {/* Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button onClick={handleEditClick} className='bg-blue-500 hover:bg-blue-600 text-white'>Edit Data</Button>
                    <Button onClick={handleSearchClick} className='bg-yellow-500 hover:bg-yellow-600 text-white'>Search Alumni</Button>
                    <Button onClick={handleSeeReview} className='bg-green-500 hover:bg-green-600 text-white'>See Review</Button>
                    <Button
                        onClick={handleSignOut}
                        className='bg-red-500 hover:bg-red-600 text-white'>Logout</Button>
                </div>
            </Card>

            {/* Cards below profile */}
            <div className="flex gap-4 min-w-8/12 max-w-3xl">
                <Card className='w-1/3 p-4'>
                    <BarChart/>
                </Card>
                <Card className='w-1/3 p-4'>
                    <h3 className='text-lg font-semibold'>Card 2</h3>
                    <p>Additional Information here</p>
                </Card>
                <Card className='w-1/3 p-4'>
                    <h3 className='text-lg font-semibold'>Card 3</h3>
                    <p>Additional Information here</p>
                </Card>
            </div>
        </div>
    )
}

export default Page;
