import React, { useState } from 'react';
import { Link } from 'wouter';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-50 transition duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-primary text-xl font-bold">
          Sean Smits
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="/" className="font-medium px-3 py-2 rounded hover:bg-primary/10 transition">Projects</Link></li>
            <li><Link href="/about" className="font-medium px-3 py-2 rounded hover:bg-primary/10 transition">About</Link></li>
            <li><Link href="/contact" className="font-medium px-3 py-2 rounded hover:bg-primary/10 transition">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 hover:bg-primary/10 rounded-full transition"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} />
    </header>
  );
}
