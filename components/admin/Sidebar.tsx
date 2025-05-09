'use client';
import { adminSideBarLinks } from '@/constants/sidebar';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Session } from 'next-auth';
import { cn, getInitials } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Sidebar = ({ session }: { session: Session }) => {

  const handleSignOut = async () => {
          try {
              await signOut({ callbackUrl: '/' });
          } catch (error) {
              console.error('Error during sign out:', error);
          }
      };


  const pathname = usePathname();
  return (
    <div className="admin-sidebar">
      <div className="">
        <div className="logo">
          <h1 className='ml-5'>Alumni Tracker</h1>
        </div>
        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks && adminSideBarLinks.map((link) => {
            const isSelected = (link.route !== '/admin' && pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
            return (
              <Link
                className="flex items-center gap-4"
                href={link.route}
                key={link.route}
              >
                <div className={cn('link', isSelected && 'bg-[#0008F1] shadow-sm')}>
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      layout="fill"
                      className={`${isSelected ? 'brightness-0 invert' : ''} object-contain`}
                    />
                  </div>
                  <p className='text-white'>{link.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="user">
        <Avatar>
          <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name || 'HI')}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden items-start">
          <p className="font-semibold text-sm text-white">{session?.user?.name || 'Rheza RNA'}</p>
          <p className="text-light-500 text-xs text-gray-300">{session?.user?.email || 'daniel@void.co.id'}</p>
        </div>
        <button className="inline">
          <LogOut onClick={handleSignOut} className="w-5 h-5 stroke-slate-300 hover:stroke-red-600 transition-colors" />
        </button>

      </div>
    </div>
  );
};

export default Sidebar;
