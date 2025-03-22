import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Code, Lightbulb, Zap, Github, Linkedin } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mt-10 -mr-10 blur-3xl"></div>
            
            <div className="relative">
              <div className="inline-block mb-6 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                About Me
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Hello there! I'm Sean Smits
              </h1>
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-10">
                <div className="md:col-span-2 space-y-5 text-gray-700 dark:text-gray-300">
                  <p className="text-xl leading-relaxed">
                    Welcome to my portfolio website!
                  </p>
                  
                  <p className="leading-relaxed">
                    I'm a passionate developer focused on creating clean, functional, and user-friendly applications.
                    I specialize in modern web technologies and love exploring innovative solutions to complex problems.
                  </p>
                  
                  <p className="leading-relaxed">
                    When I'm not coding, you can find me exploring new tech, reading about design trends, or working on side projects that push my creative boundaries.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button className="rounded-full" asChild>
                      <Link href="/contact">
                        Contact Me <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <a href="https://www.linkedin.com/in/seansmits/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <a href="https://x.com/theseansmits" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square shadow-inner">
                  <img 
                    src="/assets/profile.jpeg" 
                    alt="Sean Smits" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          
          <section className="p-8 md:p-10">
            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white text-center">
              What I Bring to the Table
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Clean Code</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I write maintainable, well-documented code that follows best practices and design patterns.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Creative Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I approach problems from multiple angles to find elegant, efficient, and innovative solutions.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Performance Focus</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I optimize for speed, accessibility, and user experience in everything I build.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Skills & Technologies
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">React</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">TypeScript</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">Node.js</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">Tailwind CSS</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">UI/UX Design</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">Express</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">MongoDB</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-primary/10 transition-colors duration-300 border border-gray-100 dark:border-gray-600">
                <span className="font-medium">PostgreSQL</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}