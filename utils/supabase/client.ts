// utils/client.ts

// Import the createBrowserClient function from the @supabase/ssr package
// This function helps in creating a Supabase client that works well with server-side rendering (SSR)
import { createBrowserClient } from "@supabase/ssr";

// Define a function to create and return a Supabase client
// This function uses environment variables for the Supabase URL and anonymous key
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // The URL of your Supabase project
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // The anonymous key for your Supabase project
  );
