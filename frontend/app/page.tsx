'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-black">
      <div className="max-w-xl w-full text-center space-y-10 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Expense Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Take control of your finances. Track your spending, manage custom categories, and analyze your habits seamlessly.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link 
            href="/login" 
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Log In
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition shadow-sm"
          >
            Create an Account
          </Link>
        </div>
        
      </div>
    </div>
  );
}
