import type { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
};
