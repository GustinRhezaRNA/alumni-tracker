import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

import SessionWrapper from '@/components/SessionWrapper';


const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Alumni Tracker',
  description: 'Aplikasi untuk melacak alumni dan kegiatan mereka',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${poppins.variable} font-sans bg-[#001E80] text-white`}>
      <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}