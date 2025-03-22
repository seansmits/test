import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
}

export default function ProjectsGrid({ projects, isLoading }: ProjectsGridProps) {
  // Create a skeleton array for loading state
  const skeletonArray = Array(6).fill(null);
  
  return (
    <section className="pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {isLoading ? (
          // Show skeletons when loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skeletonArray.map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[450px]">
                <Skeleton className="w-full h-[200px]" />
                <div className="p-5 flex-1 flex flex-col">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <div className="flex flex-wrap gap-2 mt-auto mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          // Show projects
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                delayClass={
                  index % 3 === 0 
                    ? '' 
                    : index % 3 === 1 
                      ? 'animate-fade-in-up-delay-1' 
                      : 'animate-fade-in-up-delay-2'
                } 
              />
            ))}
          </div>
        ) : (
          // No projects found
          <div className="flex flex-col items-center justify-center py-12">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
