'use client';

import { Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const {isSignedIn} = useAuth();
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
          <Link href={'/'} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            CareerPrepAI
          </Link>
        </div>

      <div className="hidden md:flex space-x-6 items-center bg-gray-800 rounded-full p-2">
  <Link href="#features" className="animated-link pl-4 cursor-pointer">Features</Link>
  <Link href="#how-it-works" className="animated-link cursor-pointer">How It Works</Link>
  <Link href="#benefits" className="animated-link cursor-pointer">Benefits</Link>

  <button onClick={() => router.push('/pricing')} className="animated-link">Pricing</button>

  <SignedOut>
    <SignInButton mode="modal">
      <button className="animated-link pl-2 cursor-pointer">Sign In</button>
    </SignInButton>
    <SignUpButton mode="modal">
      <button className="animated-link pl-2 cursor-pointer">Sign Up</button>
    </SignUpButton>
  </SignedOut>

 
    {isSignedIn && (
      <>
        <Link href="/dashboard" className="animated-link cursor-pointer">Dashboard</Link>
        <Link href="/resume" className="animated-link cursor-pointer">Resume</Link>
        <Link href="/interviewpanel" className="animated-link  cursor-pointer">Interview</Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </>
    )}
      
 

  <div className="pr-2 animated-link cursor-pointer">
    <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
  </div>
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