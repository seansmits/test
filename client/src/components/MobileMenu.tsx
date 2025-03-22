import React from 'react';
import { Link } from 'wouter';

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/" 
              className="block px-3 py-2 rounded hover:bg-primary/10 transition"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded hover:bg-primary/10 transition"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className="block px-3 py-2 rounded hover:bg-primary/10 transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
