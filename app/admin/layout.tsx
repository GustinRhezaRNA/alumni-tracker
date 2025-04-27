'use client';

import { useSession } from 'next-auth/react';
import { useEffect, ReactNode } from 'react';
import {  useRouter } from 'next/navigation'; // Use redirect from next/navigation
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import './admin.css';
import LoadingSpinner from '@/components/LoadingSpinner';
// import { db } from '@/database/drizzle';
// import { users } from '@/database/schema';
// import { eq } from 'drizzle-orm';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
        router.push('/')
    }

}, [status, session, router]);

if (status === "loading") {
    return <LoadingSpinner />;
}
  
  

  return (
    <main className="flex min-h-screen w-full w-row">
      <Sidebar session={session} />
      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default Layout;
