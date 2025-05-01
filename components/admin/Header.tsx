import { Session } from 'next-auth';
import React from 'react';

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div className="">
      <h2 className="text-2xl font-bold text-gray-800">{session?.user?.name || 'Hi Rheza'}</h2>
      <p className="text-base text-slate-500">Monitor all of your data here</p>
      </div>
    </header>

   
  );
};

export default Header;
