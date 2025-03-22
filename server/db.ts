import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema';
import { log } from './vite';

// In-memory fallback for when database is unavailable
let useInMemoryFallback = false;
const inMemoryProjects: schema.Project[] = [];
const inMemorySubscribers: schema.Subscriber[] = [];

// Function to create a database pool with optimal settings
const createPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // Slightly increased connections
    idleTimeoutMillis: 20000, // Keep idle clients longer
    connectionTimeoutMillis: 10000, // Longer timeout for initial connection
    query_timeout: 15000, // Add explicit query timeout
    statement_timeout: 15000, // Add statement timeout
  });
};

// Create the pool
const pool = createPool();

// Handle pool errors
pool.on('error', (err: any) => {
  log(`Database pool error: ${err.message}`, 'db');
  console.error('Database pool error:', err);
  
  // Don't crash on connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    log('Database connection refused or timed out. Will retry.', 'db');
  }
});

// Test connection with retry logic
const testConnection = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      client.release();
      log('Successfully connected to PostgreSQL database', 'db');
      useInMemoryFallback = false;
      return true;
    } catch (err) {
      log(`Database connection attempt ${i+1}/${retries} failed: ${(err as Error).message}`, 'db');
      
      if (i === retries - 1) {
        log('Falling back to in-memory storage after failed connection attempts', 'db');
        useInMemoryFallback = true;
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Attempt initial connection
testConnection();

// Create a Drizzle ORM instance with our schema
export const db = drizzle(pool, { schema });

// Check if database is available
export const isDatabaseAvailable = () => !useInMemoryFallback;

// Helper function to execute database operations with retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  retries = 2,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      // Skip trying if we're in fallback mode already
      if (useInMemoryFallback) {
        log(`Database in fallback mode, skipping database operation`, 'db');
        return fallback;
      }
      
      // Set a timeout in case the operation hangs
      const opWithTimeout = Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Operation timed out')), 15000)
        )
      ]);
      
      return await opWithTimeout as T;
    } catch (error) {
      const errMsg = (error as Error).message;
      const isLastAttempt = i === retries;
      
      log(`Database operation ${isLastAttempt ? 'failed' : 'retry'} (${i+1}/${retries+1}): ${errMsg}`, 'db');
      
      // For specific database errors, we might want to fail immediately
      if (
        typeof error === 'object' && 
        error !== null && 
        'code' in error && 
        (error.code === '57P01' || error.code === '57P03' || error.code === '53000')
      ) {
        // Admin shutdown, crash shutdown, or out of resources - no point retrying
        log(`Critical database error (${error.code}), returning fallback`, 'db');
        return fallback;
      }
      
      if (isLastAttempt) {
        // We've exhausted all retries
        log(`Exhausted retries for database operation, using fallback`, 'db');
        return fallback;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  // This should never be reached due to the loop structure, but TypeScript needs it
  return fallback;
};

// Process shutdown handler to close pool
process.on('SIGINT', () => {
  pool.end().then(() => {
    log('Database pool has ended', 'db');
    process.exit(0);
  });
});