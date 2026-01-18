'use client';

import { useEffect } from 'react';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Suppress error logging to console (prevent error popups)
    console.error('Watchlist error:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-8 px-4 md:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto flex flex-col items-center justify-center gap-8 min-h-[70vh]'>
        <div className='relative group'>
          <div className='absolute inset-0 bg-gradient-to-r from-red-600/25 via-rose-500/20 to-pink-600/25 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500'></div>
          <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-red-500/40 rounded-2xl p-12 max-w-md w-full hover:border-red-500/80 transition-all duration-300 shadow-2xl text-center'>
            <div className='flex flex-col items-center gap-6'>
              <div className='h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center'>
                <AlertCircle className='h-10 w-10 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                  Watchlist Unavailable
                </h2>
                <p className='text-gray-400 text-sm leading-relaxed mb-4'>
                  We're having trouble loading your watchlist. This might be temporary. Please try again.
                </p>
              </div>
              <div className='flex flex-col gap-3 w-full'>
                <button
                  onClick={reset}
                  className='px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl'
                >
                  Try Again
                </button>
                <Link
                  href='/'
                  className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                >
                  <Home className='h-4 w-4' />
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
