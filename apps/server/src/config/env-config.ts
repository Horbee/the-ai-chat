import dotenv from "dotenv";

import { z } from "zod";
import { formatErrors } from "../utils/zod-format";

import type { ServerEnvironment } from "@repo/types";

dotenv.config();

const variables = {
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DEEPL_KEY: process.env.DEEPL_KEY,
  DEEPL_API: process.env.DEEPL_API,
  JWT_SECRET: process.env.JWT_SECRET,
};

const environmentSchema = z.object({
  PORT: z.preprocess(
    (port) => parseInt(z.string().parse(port), 10),
    z.number()
  ),
  CORS_ORIGIN: z.string().min(1),
  DEEPL_KEY: z.string().min(1),
  DEEPL_API: z.string(),
  JWT_SECRET: z.string().min(1),
});

const _variables = environmentSchema.safeParse(variables);

if (!_variables.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_variables.error.format())
  );
  throw new Error("Invalid environment variables");
}

export const env = _variables.data as ServerEnvironment;
