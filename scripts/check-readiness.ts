#!/usr/bin/env npx tsx

import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const optionalEnv = [
  "ANTHROPIC_API_KEY",
  "GITHUB_TOKEN",
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "GITHUB_BRANCH",
  "VERCEL_DEPLOY_HOOK",
];

const migrationPath = path.join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260426_000002_crm_app_alignment.sql",
);

const missingRequired = requiredEnv.filter((key) => !process.env[key]?.trim());
const missingOptional = optionalEnv.filter((key) => !process.env[key]?.trim());
const migrationExists = fs.existsSync(migrationPath);

console.log("CRM readiness check");
console.log("===================");

if (missingRequired.length === 0) {
  console.log("Required env: OK");
} else {
  console.log(`Required env missing: ${missingRequired.join(", ")}`);
}

if (missingOptional.length === 0) {
  console.log("Optional integrations: fully configured");
} else {
  console.log(`Optional integrations missing: ${missingOptional.join(", ")}`);
}

console.log(
  migrationExists
    ? "Schema alignment migration: present"
    : "Schema alignment migration: missing",
);

console.log("");
console.log("Next manual checks:");
console.log("1. Apply the latest Supabase migration to the real database.");
console.log("2. Verify Vercel project env vars match .env.local.");
console.log("3. Open /dashboard, /investors, /outreach, /followups in the browser.");

if (missingRequired.length > 0 || !migrationExists) {
  process.exitCode = 1;
}
