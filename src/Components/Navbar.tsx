'use client';

import { Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { useState } from 'react';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <nav className="container mx-auto px-6 text-gray-600  py-4 flex justify-between items-center">
       <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Wand2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            CareerPrepAI
          </span>
        </div>

      <div className="hidden md:flex space-x-6 items-center">
        <a href="#features" className="nav-link hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="nav-link hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
          How It Works
        </a>
        <a href="#benefits" className="nav-link hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
          Benefits
        </a>
        <button 
          onClick={() => router.push('/pricing')} 
          className="nav-link hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
        >
          Pricing
        </button>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </SignedIn>

        <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
      </div>
    </nav>
  );
}

function DarkModeToggle({
  isDark,
  toggleDarkMode,
}: {
  isDark: boolean;
  toggleDarkMode: () => void;
}) {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}