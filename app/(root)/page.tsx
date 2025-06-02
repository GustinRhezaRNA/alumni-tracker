'use client'

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Home = () => {

  const router = useRouter();

  const handleLogin = () => {
    router.push('/sign-in');
  };

  return (
    
    <main className="bg-blue-800 h-screen">
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg w-[80vw] max-w-6xl">
        <h1 className="text-white text-2xl ">Alumni Tracker</h1>
        <Button variant="secondary" onClick={handleLogin}>Login</Button>
      </nav>
      <header className="flex flex-col md:flex-row justify-center items-center h-screen mx-auto bg-[url('/assets/header-bg.png')] bg-cover bg-center w-full px-6 md:px-20 lg:px-48 ">
        <div className="flex flex-col w-full md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-white font-semibold text-3xl md:text-5xl">
            Stay Connected, Share <br />
            Your Journey, and Inspire <br /> the Next Generation!
          </h1>
          <p className="text-white text-base md:text-lg my-2 md:my-4">
            Here where your hard work <br />
            will be monitored and reviewed
          </p>
          <div className="flex justify-center md:justify-start">
            <Button className="w-44 h-12 bg-[#FFD700] text-black buttonShadow" onClick={handleLogin}>Login</Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0"></div>
      </header>
      <section
        id="about"
        className=""
      >
        <div className="flex flex-col h-screen  justify-center py-12 bg-[#001E80] bg-cover bg-center  px-6 md:px-20 lg:px-48">
          <h2 className="text-7xl italic text-white">About </h2>
          <p className="text-white my-4 text-2xl">
          Alumni Tracker is an alumni tracking system that helps institutions monitor graduates' careers,
          strengthen relationships with alumni, and provide data for educational development and accreditation.
            Alumni Tracker is a platform designed to connect alumni with their community and new opportunities. With an integrated system, we simplify alumni data tracking, support collaboration, and provide the latest updates on alumni achievements and contributions in various fields.
          </p>
          <div className="flex gap-40 justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl italic text-white py-4">Alumni Riview</h2>
              <p className="text-6xl text-[#FFD700] italic font-semibold mt-4">90+</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl italic text-white py-4">Listed Company</h2>
              <p className="text-6xl text-[#FFD700] italic font-semibold mt-4">21</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl italic text-white py-4">Alumni Data</h2>
              <p className="text-6xl text-[#FFD700] italic font-semibold mt-4">3.2M</p>
            </div>
          </div>
        </div>

        <div id='cta' className="grid grid-cols-4 grid-rows-5 gap-4 p-4 h-screen justify-center py-12 bg-[#001E80] px-6 md:px-20 lg:px-48">
  {/* Fitur 1 - Data Alumni */}
  <div className="bg-blue-800 col-span-2 row-span-2 text-white flex items-center justify-center rounded-xl p-6 text-center">
    <div>
      <h2 className="text-2xl font-semibold">Data Alumni</h2>
      <p className="mt-2 text-sm">Lihat informasi lulusan berdasarkan tahun, program studi, dan lokasi kerja.</p>
    </div>
  </div>

  {/* Fitur 2 - Review Perusahaan */}
  <div className="bg-gray-700 col-span-2 row-span-2 text-white flex items-center justify-center rounded-xl p-6 text-center">
    <div>
      <h2 className="text-2xl font-semibold">Review Perusahaan</h2>
      <p className="mt-2 text-sm">Baca ulasan alumni tentang lingkungan kerja dan pengalaman di berbagai perusahaan.</p>
    </div>
  </div>

  {/* Fitur 3 - Review Kinerja Alumni */}
  <div className="bg-black col-span-3 row-span-2 text-white flex items-center justify-center rounded-xl p-6 text-center">
    <div>
      <h2 className="text-2xl font-semibold">Review Kinerja Alumni</h2>
      <p className="mt-2 text-sm">Perusahaan dapat memberikan penilaian terhadap kinerja alumni di tempat kerja.</p>
    </div>
  </div>

  <div className="bg-yellow-500 col-span-1 row-span-2 text-black flex flex-col items-center justify-center rounded-xl p-6 text-center shadow-lg">
  <h2 className="text-xl font-bold mb-4">Mulai Sekarang</h2>
  <p className="text-base">Jelajahi data alumni dan ulasan perusahaan.</p>
</div>
</div>

        <div id='cta' className="grid grid-cols-4 grid-rows-5 gap-4 p-4 h-screen justify-center py-12 bg-[#001E80] bg-cover bg-center px-6 md:px-20 lg:px-48">
          <div className="bg-[url('/assets/bgbox1.png')] bg-cover bg-center col-span-1 row-span-2  text-white flex items-center justify-center rounded-xl"></div>
          <div className="bg-[url('/assets/bgbox2.png')]  bg-cover bg-center col-span-1 row-span-1 bg-gray-700 text-white flex items-center justify-center rounded-xl"></div>
          <div className="bg-[url('/assets/bgbox3.png')]  bg-cover bg-center col-span-1 row-span-1  text-black flex items-center justify-center rounded-xl"></div>
          <div className="bg-[url('/assets/bgbox4.png')]  bg-cover bg-center col-span-1 row-span-3 bg-black text-white flex items-center justify-center rounded-xl"></div>
          <div className="col-span-2 row-span-2 bg-bl-400 bg-black text-white flex items-center  rounded-xl p-4 text-3xl justify-end">Reconnect with alumni and build a stronger network. Discover success stories, career opportunities, and new inspiration here!


            <Button className="w-44 h-12 bg-[#FFD700] text-black buttonShadow ">Get Started</Button>
          </div>
          <div className="bg-[url('/assets/bgbox6.png')]  bg-cover bg-center col-span-1 row-span-2 bg-gray-900 text-white flex items-center justify-center rounded-xl "></div>
          <div className="bg-[url('/assets/bgbox7.png')] bg-cover bg-center  col-span-3 row-span-1 bg-yel-900 text-black flex items-center justify-center rounded-xl  text-2xl"><p className='text-right'>Together we grow, together we thrive. Start your journey of building meaningful alumni connections today!</p></div>
        </div>
        <div className=""></div>
      </section>
      <footer className="text-white text-xs md:text-sm text-center py-3 w-full bg-black">

        © {new Date().getFullYear()}  <span className="font-semibold text-blue-200">Tracker Alumni
        \</span> All Rights Reserved, Inc.

      </footer>
    </main>
  );
}


export default Home;