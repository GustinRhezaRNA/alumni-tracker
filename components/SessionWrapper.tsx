/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SessionProvider } from 'next-auth/react';

const SessionWrapper = ({ children, session }: { children: React.ReactNode; session: any }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionWrapper;
