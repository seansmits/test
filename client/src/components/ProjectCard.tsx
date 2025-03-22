import React from 'react';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import { Project } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
  delayClass?: string;
}

export default function ProjectCard({ project, delayClass = '' }: ProjectCardProps) {
  const { title, description, imageUrl, date, tags, detailsUrl, siteUrl } = project;
  
  // Format the date
  const formattedDate = formatDate(date);
  
  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 flex flex-col animate-fade-in-up ${delayClass}`}>
      <div className="relative pt-[56.25%] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="shadow-sm opacity-90">
            {formattedDate}
          </Badge>
        </div>
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-primary/5 border-primary/10 text-primary text-xs font-normal">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary text-xs font-normal">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-5">{description}</p>
        
        <div className="flex gap-3 mt-auto">
          {detailsUrl && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a 
                href={detailsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Details <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          
          {siteUrl && (
            <Button size="sm" className="flex-1" asChild>
              <a 
                href={siteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {siteUrl.includes('github.com') ? (
                  <>GitHub <Github className="ml-1.5 h-3.5 w-3.5" /></>
                ) : (
                  <>Visit <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></>
                )}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString: Date | string): string {
  if (typeof dateString === 'string') {
    dateString = new Date(dateString);
  }
  
  // Format date to display month and year
  return dateString.toLocaleDateString('en-US', { 
    month: 'short',
    year: 'numeric'
  });
}
