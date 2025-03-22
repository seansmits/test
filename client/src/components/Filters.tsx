import React from 'react';
import { Search } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

export default function Filters({ 
  searchQuery, 
  onSearchChange, 
  tags, 
  activeTag, 
  onTagChange, 
  sortOption, 
  onSortChange 
}: FiltersProps) {
  return (
    <section className="pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md min-w-[250px]">
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary transition"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button 
                key={tag}
                className={`px-3 py-1 text-sm rounded transition ${
                  activeTag === tag 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                onClick={() => onTagChange(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Sort Select */}
          <div className="relative min-w-[180px]">
            <select 
              className="w-full px-3 py-2 border-2 border-primary/20 rounded-lg appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary transition"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="titleDesc">Title Z-A</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
