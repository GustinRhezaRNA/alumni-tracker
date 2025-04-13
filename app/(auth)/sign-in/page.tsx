'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {

  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div
      id='login'
      className="flex items-center justify-center min-h-screen bg-[url('/assets/login-bg.png')] bg-cover bg-center">
      <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center ">Sign in to Your Account</h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <CardContent>
          <form
            action={async () => {
              await signIn("google", )
            }}
          >
            <Button type="submit"
              className="w-full bg-[#4285F4] text-white hover:bg-blue-300 border border-gray-400 flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" /> Signin with Google
            </Button>
          </form>
        </CardContent>
        <p className="text-center text-xs ">
          Don’t have an account? Use your Google account to sign up.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
