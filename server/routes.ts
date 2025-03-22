import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertSubscriberSchema, subscribers } from "@shared/schema";
import { z } from "zod";
import { db, withRetry } from "./db";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for projects
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    log("Fetching all projects", "api");
    
    // Get projects using storage method (which already uses withRetry)
    const projects = await storage.getAllProjects();
    
    // Make sure we return in the expected format { projects: [] }
    res.json({ projects });
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      log(`Fetching project with id ${id}`, "api");
      const project = await storage.getProject(id);
      
      if (!project) {
        log(`Project with id ${id} not found`, "api");
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      log(`Error fetching project with id ${req.params.id}: ${(error as Error).message}`, "api");
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      // Validate request body using zod schema
      const validatedData = insertProjectSchema.parse(req.body);
      
      log(`Creating new project: ${validatedData.title}`, "api");
      const project = await storage.createProject(validatedData);
      
      log(`Successfully created project with id ${project.id}`, "api");
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        log(`Validation error creating project: ${JSON.stringify(error.errors)}`, "api");
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      
      log(`Error creating project: ${(error as Error).message}`, "api");
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update a project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        log(`Invalid project ID for update: ${req.params.id}`, "api");
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      log(`Updating project ${id} with data: ${JSON.stringify(validatedData)}`, "api");
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        log(`Project not found for update: ${id}`, "api");
        return res.status(404).json({ error: "Project not found" });
      }
      
      log(`Successfully updated project ${id}`, "api");
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        log(`Validation error updating project ${req.params.id}: ${JSON.stringify(error.errors)}`, "api");
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      
      log(`Error updating project ${req.params.id}: ${(error as Error).message}`, "api");
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete a project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        log(`Invalid project ID for deletion: ${req.params.id}`, "api");
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      log(`Attempting to delete project ${id}`, "api");
      const success = await storage.deleteProject(id);
      
      if (!success) {
        log(`Project not found for deletion: ${id}`, "api");
        return res.status(404).json({ error: "Project not found" });
      }
      
      log(`Successfully deleted project ${id}`, "api");
      res.status(204).end();
    } catch (error) {
      log(`Error deleting project ${req.params.id}: ${(error as Error).message}`, "api");
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/subscribers", async (req, res) => {
    try {
      // Validate request body using zod schema
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      log(`Processing newsletter subscription for: ${validatedData.email}`, "db");
      
      // Use withRetry for database operation
      const result = await withRetry(
        async () => {
          const [subscriber] = await db.insert(subscribers)
            .values(validatedData)
            .returning();
          return subscriber;
        },
        null as any,
        2,
        1000
      );
      
      // If result is null, it means all retries failed
      if (!result) {
        log(`Failed to subscribe ${validatedData.email} after retries`, "db");
        return res.status(500).json({ 
          success: false,
          error: "Failed to subscribe to newsletter. Please try again later." 
        });
      }
      
      log(`Successfully subscribed: ${validatedData.email}`, "db");
      res.status(201).json({
        success: true,
        message: "Successfully subscribed to the newsletter!",
        data: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      // Check for duplicate email error (PostgreSQL unique constraint)
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        return res.status(409).json({ 
          success: false,
          error: "This email is already subscribed to our newsletter." 
        });
      }
      
      // Log the error for debugging
      log(`Newsletter subscription error: ${(error as Error).message}`, "db");
      
      // Return a friendly error message
      res.status(500).json({ 
        success: false,
        error: "Failed to subscribe to newsletter. Please try again later." 
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
