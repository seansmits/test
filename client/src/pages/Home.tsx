import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Filters from '@/components/Filters';
import ProjectsGrid from '@/components/ProjectsGrid';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { useState, useMemo } from 'react';

export default function Home() {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Fetch projects data
  const { data, isLoading } = useQuery<{ projects: Project[] }>({
    queryKey: ['/api/projects'],
  });
  
  // Extract projects array from response
  const projects = data?.projects || [];

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query)
      );
    }

    // Filter by tag
    if (activeTag && activeTag !== 'All') {
      result = result.filter(project => 
        project.tags.includes(activeTag)
      );
    }

    // Sort projects
    switch (sortOption) {
      case 'newest':
        return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return result.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [projects, searchQuery, activeTag, sortOption]);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return ['All', ...Array.from(tags)];
  }, [projects]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Filters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tags={allTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
        <ProjectsGrid projects={filteredProjects} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
}
