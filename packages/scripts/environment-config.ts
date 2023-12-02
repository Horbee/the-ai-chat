#!/usr/bin/env -S pnpx ts-node

import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";
import { randomBytes } from "crypto";

import type { NuxtEnvironment, ServerEnvironment } from "@repo/types";

const SECRET = randomBytes(32).toString("base64");

const NuxtVariables: NuxtEnvironment = {
  NUXT_SECRET: SECRET,
  AUTH_ORIGIN: "http://localhost:3000",
  DATABASE_URL: "postgresql://postgres:admin@localhost:5432/the-ai-chat-db",
  EMAIL_SERVER: "smtp://localhost:1025",
  EMAIL_FROM: "noreply@example.com",
  SERVER_URL: "http://localhost:8888",
};

const ServerVariables: ServerEnvironment = {
  PORT: 8888,
  CORS_ORIGIN: "http://localhost:3000",
  DEEPL_KEY: "<deeplKey>",
  DEEPL_API: "https://api-free.deepl.com/v2/translate",
  JWT_SECRET: SECRET,
};

function createEnvFileForNuxtApp() {
  const envContent = Object.entries(NuxtVariables)
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
  const envContent = Object.entries(ServerVariables)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n")
    .replace("<deeplKey>", deeplKey);

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
