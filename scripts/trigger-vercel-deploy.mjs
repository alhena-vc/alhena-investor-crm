import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const hook = process.env.VERCEL_DEPLOY_HOOK;

if (!hook) {
  console.error("VERCEL_DEPLOY_HOOK is missing in .env.local");
  process.exit(1);
}

const response = await fetch(hook, { method: "POST" });

if (!response.ok) {
  const body = await response.text();
  console.error(`Vercel deploy hook failed: ${response.status} ${body}`);
  process.exit(1);
}

console.log("Vercel deploy hook triggered successfully.");
