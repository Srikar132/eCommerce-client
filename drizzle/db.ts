import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Configure Neon connection for serverless environments
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });