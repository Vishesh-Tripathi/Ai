'use client';

import { Wand2, Menu, X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full backdrop-blur-3xl shadow-md fixed z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Wand2 className="w-5 h-5" />
          </div>
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            CareerPrepAI
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6 items-center bg-gray-800 text-white rounded-full px-4 py-2">
          {/* <Link href="#features" className="hover:text-blue-300  ">Features</Link> */}
          {/* <Link href="#how-it-works" className="hover:text-blue-300">How It Works</Link> */}
          {/* <Link href="#benefits" className="hover:text-blue-300">Benefits</Link> */}
          <button onClick={() => router.push('/pricing')} className="hover:text-blue-300">Pricing</button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="hover:text-blue-300">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="hover:text-blue-300">Sign Up</button>
            </SignUpButton>
          </SignedOut>

          {isSignedIn && (
            <>
              <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
              <Link href="/resume" className="hover:text-blue-300">Resume</Link>
              <Link href="/interviewpanel" className="hover:text-blue-300">Interview</Link>
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </>
          )}

          {/* <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} /> */}
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 dark:text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-4">
          {/* <Link href="#features" onClick={toggleMenu} className="block text-gray-800 dark:text-white">Features</Link> */}
          {/* <Link href="#how-it-works" onClick={toggleMenu} className="block text-gray-800 dark:text-white">How It Works</Link> */}
          {/* <Link href="#benefits" onClick={toggleMenu} className="block text-gray-800 dark:text-white">Benefits</Link> */}
          <button onClick={() => { router.push('/pricing'); toggleMenu(); }} className="block text-left w-full text-gray-800 dark:text-white">Pricing</button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="block text-gray-800 dark:text-white">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="block text-gray-800 dark:text-white">Sign Up</button>
            </SignUpButton>
          </SignedOut>

          {isSignedIn && (
            <>
              <Link href="/dashboard" onClick={toggleMenu} className="block text-gray-800 dark:text-white">Dashboard</Link>
              <Link href="/resume" onClick={toggleMenu} className="block text-gray-800 dark:text-white">Resume</Link>
              <Link href="/interviewpanel" onClick={toggleMenu} className="block text-gray-800 dark:text-white">Interview</Link>
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </>
          )}

          {/* <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} /> */}
        </div>
      )}
    </nav>
  );
}
