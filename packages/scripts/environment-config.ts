#!/usr/bin/env -S pnpm exec ts-node

import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";

const NuxtEnvironment = {
  NUXT_SECRET: "supersecret",
  AUTH_ORIGIN: "http://localhost:3000",
  DATABASE_URL: "postgresql://postgres:admin@localhost:5432/the-ai-chat-db",
  EMAIL_SERVER: "smtp://localhost:1025",
  EMAIL_FROM: "noreply@example.com",
  SERVER_URL: "http://localhost:8888",
};

const ServerEnvironment = {
  PORT: "8888",
  CORS_ORIGIN: "http://localhost:3000",
  DEEPL_KEY: "deeplKey",
  JWT_SECRET: "supersecret",
};

function createEnvFileForNuxtApp() {
  const envContent = Object.entries(NuxtEnvironment)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  const destinationFolder = "../../apps/nuxt";

  try {
    const destinationPath = path.join(__dirname, destinationFolder, ".env");
    fs.writeFileSync(destinationPath, envContent);

    console.log(".env file for Nuxt App created successfully.");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

function createEnvFileForServerApp(deeplKey: string) {
  const envContent = Object.entries(ServerEnvironment)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n")
    .replace("deeplKey", deeplKey);

  const destinationFolder = "../../apps/server";

  try {
    const destinationPath = path.join(__dirname, destinationFolder, ".env");
    fs.writeFileSync(destinationPath, envContent);

    console.log(".env file for Server App created successfully.");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

const argv = yargs
  .scriptName("environment-config.ts")
  .option("DEEPL_KEY", {
    describe: "API key for DeepL",
    demandOption: true, // Make DEEPL_KEY a required argument
    type: "string",
  })
  .help()
  .parseSync();

createEnvFileForNuxtApp();
createEnvFileForServerApp(argv.DEEPL_KEY);
