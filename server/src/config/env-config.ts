import dotenv from "dotenv";

import { z } from "zod";
import { formatErrors } from "../utils/zod-format";

dotenv.config();

const variables = {
  PORT: process.env.PORT || 8888,
  DEEPL_KEY: process.env.DEEPL_KEY,
  DEEPL_API: process.env.DEEPL_API || "https://api-free.deepl.com/v2/translate",
};

const environmentSchema = z.object({
  PORT: z.preprocess(
    (port) => parseInt(z.string().parse(port), 10),
    z.number()
  ),
  DEEPL_KEY: z.string().min(1),
  DEEPL_API: z.string(),
});

const _variables = environmentSchema.safeParse(variables);

if (!_variables.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_variables.error.format())
  );
  throw new Error("Invalid environment variables");
}

export const env = _variables.data;
