// This file could include any helper functions related to data fetching or transformations
import { Project } from '@shared/schema';

// Helper function to format timestamps consistently
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

// Helper function to convert form data to project data
export const projectFormToProjectData = (formData: any): Omit<Project, 'id'> => {
  return {
    title: formData.title,
    description: formData.description,
    imageUrl: formData.imageUrl,
    date: new Date(formData.date),
    tags: formData.tags.split(',').map((tag: string) => tag.trim()),
    detailsUrl: formData.detailsUrl || null,
    siteUrl: formData.siteUrl || null
  };
};
