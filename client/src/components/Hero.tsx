import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [activeWord, setActiveWord] = useState(0);
  const words = ['Web Apps', 'Tools', 'Interfaces', 'Experiences'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Sean Smits • Portfolio
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            I build modern <span className="relative">
              <span className="text-primary relative">
                {words[activeWord]}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded"></span>
              </span>
            </span>
            <br className="hidden md:block" /> that solve real problems
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
            A collection of projects focused on clean design, performance, and user experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-6 rounded-full" asChild>
              <Link href="/about">About Me <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-6 rounded-full" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
          
          <div className="mt-16 w-full max-w-3xl mx-auto relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 pointer-events-none"></div>
              <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 relative">
                <div className="text-center p-8">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Featured Projects</h3>
                  <p className="text-gray-600 dark:text-gray-300">Scroll down to explore my work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
