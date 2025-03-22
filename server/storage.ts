import { users, type User, type InsertUser, type Project, type InsertProject, projects, type Subscriber, type InsertSubscriber, subscribers } from "@shared/schema";
import { db, isDatabaseAvailable, withRetry } from "./db";
import { eq, desc } from "drizzle-orm";
import { log } from "./vite";

// Storage interface with CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project CRUD operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    log(`Fetching user with id ${id}`, "db");
    
    return await withRetry(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      },
      undefined,
      2,
      1000
    );
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    log(`Fetching user with username ${username}`, "db");
    
    return await withRetry(
      async () => {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
      },
      undefined,
      2,
      1000
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    log(`Creating new user: ${insertUser.username}`, "db");
    
    return await withRetry(
      async () => {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      },
      {} as User,
      2,
      1000
    );
  }

  async getAllProjects(): Promise<Project[]> {
    log("Starting database query for all projects", "db");
    
    // Use the withRetry helper function for database operation
    return await withRetry(
      // The database operation to execute
      async () => {
        const result = await db.select().from(projects).orderBy(desc(projects.date));
        log(`Successfully fetched ${result.length} projects from database`, "db");
        return result;
      },
      // Fallback value if operation fails
      [],
      // Number of retries
      2,
      // Delay between retries (ms)
      1000
    );
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    log(`Fetching project with id ${id}`, "db");
    
    return await withRetry(
      async () => {
        const [project] = await db.select().from(projects).where(eq(projects.id, id));
        return project;
      },
      undefined,
      2,
      1000
    );
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    log(`Creating new project: ${insertProject.title}`, "db");
    
    return await withRetry(
      async () => {
        const [project] = await db.insert(projects).values({
          ...insertProject,
          detailsUrl: insertProject.detailsUrl || null,
          siteUrl: insertProject.siteUrl || null
        }).returning();
        return project;
      },
      // This fallback would only be used if all retries fail and we're in a situation
      // where we'd otherwise throw an exception, so it should never actually be returned
      {} as Project,
      2,
      1000
    );
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    log(`Updating project ${id}`, "db");
    
    return await withRetry(
      async () => {
        const [updatedProject] = await db.update(projects)
          .set(projectData)
          .where(eq(projects.id, id))
          .returning();
        
        return updatedProject;
      },
      undefined,
      2,
      1000
    );
  }
  
  async deleteProject(id: number): Promise<boolean> {
    log(`Deleting project ${id}`, "db");
    
    return await withRetry(
      async () => {
        await db.delete(projects).where(eq(projects.id, id));
        return true;
      },
      false,
      2,
      1000
    );
  }

  // Initialize sample projects if needed
  async initSampleProjects() {
    // Skip initialization if database is not available
    if (!isDatabaseAvailable()) {
      log("Database not available, skipping sample project initialization", "db");
      return;
    }
    
    log("Checking for existing projects", "db");
    
    // Use withRetry to check for existing projects
    const existingProjects = await withRetry(
      async () => {
        return await db.select().from(projects);
      },
      [] as Project[],
      2,
      1000
    );
    
    if (existingProjects.length === 0) {
      log("No existing projects found, initializing sample data", "db");
      
      const sampleProjects: InsertProject[] = [
        {
          title: "React Task Tracker",
          description: "A modern task management application built with React, featuring drag-and-drop functionality and local storage persistence.",
          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
          date: new Date("2023-06-15"),
          tags: ["React", "TypeScript", "TailwindCSS"],
          detailsUrl: "https://github.com/seansmits/react-task-tracker",
          siteUrl: "https://react-task-tracker.seansmits.com"
        },
        {
          title: "E-commerce Dashboard",
          description: "An admin dashboard for e-commerce websites with sales analytics, inventory management, and customer insights.",
          imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
          date: new Date("2023-04-20"),
          tags: ["React", "TypeScript", "Chart.js"],
          detailsUrl: "https://github.com/seansmits/ecommerce-dashboard",
          siteUrl: "https://dashboard.seansmits.com"
        },
        {
          title: "Weather App",
          description: "Minimalist weather application with location detection, 7-day forecast, and severe weather alerts.",
          imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809",
          date: new Date("2023-01-05"),
          tags: ["React", "TypeScript", "API Integration"],
          detailsUrl: "https://github.com/seansmits/weather-app",
          siteUrl: "https://weather.seansmits.com"
        }
      ];

      // Insert sample projects one at a time with error handling
      for (const project of sampleProjects) {
        try {
          // Use withRetry for creating each project
          await withRetry(
            async () => this.createProject(project),
            null as any,
            1,
            500
          );
          log(`Successfully created sample project: ${project.title}`, "db");
        } catch (error) {
          log(`Failed to create sample project: ${project.title}`, "db");
        }
      }
      
      log("Sample projects have been initialized", "db");
    } else {
      log(`Found ${existingProjects.length} existing projects, skipping initialization`, "db");
    }
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();

// Initialize sample data
(async () => {
  const dbStorage = storage as DatabaseStorage;
  await dbStorage.initSampleProjects();
})();
