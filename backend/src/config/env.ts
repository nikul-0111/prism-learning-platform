import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default("prism-secret-key-12345"),
  AUTH_SECRET: z.string().default("prism-auth-secret-12345"),
  
  // S3 / MinIO Storage Environment Variables
  S3_ENDPOINT: z.string().default("http://localhost:9000"),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET: z.string().default("prism-videos"),
  S3_ACCESS_KEY_ID: z.string().default("minioadmin"),
  S3_SECRET_ACCESS_KEY: z.string().default("minioadmin"),
  S3_FORCE_PATH_STYLE: z.string().default("true").transform((v) => v === "true"),

  // Redis Environment Variables
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379").transform(Number),
  REDIS_PASSWORD: z.string().optional(),

  // Video Constraints
  VIDEO_MAX_SIZE_BYTES: z.string().default("2147483648").transform(Number), // 2GB
  VIDEO_MAX_DURATION_SECONDS: z.string().default("14400").transform(Number), // 4 hours
  VIDEO_PART_SIZE_BYTES: z.string().default("10485760").transform(Number), // 10MB
});

export const env = envSchema.parse(process.env);