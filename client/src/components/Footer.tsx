import React from 'react';
import { Mail, Globe } from 'lucide-react';
import { SiGithub, SiLinkedin, SiMastodon } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">About Me</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Frontend developer specializing in React and TypeScript, focused on creating clean, responsive and user-friendly applications.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:contact@seansmits.com" className="hover:text-primary transition">
                  contact@seansmits.com
                </a>
              </li>
              <li className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <a href="#" className="hover:text-primary transition">
                  seansmits.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition"
                aria-label="GitHub"
              >
                <SiGithub className="text-primary" size={20} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="text-primary" size={20} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition"
                aria-label="Mastodon"
              >
                <SiMastodon className="text-primary" size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Sean Smits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
