import { Project } from '@shared/schema';

// Add any additional types that might be needed here

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ProjectResponse {
  projects: Project[];
}
