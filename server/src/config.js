import "dotenv/config";

const required = ["MONGODB_URI"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  for (const key of ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"]) {
    if (!process.env[key] || process.env[key].length < 32) {
      throw new Error(`Missing or too short environment variable: ${key}`);
    }
  }
}

const clientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  isProduction,
  port: Number(process.env.PORT || 5050),
  mongoUri: process.env.MONGODB_URI,
  accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET || "learnhub-dev-access-secret-change-me",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || "learnhub-dev-refresh-secret-change-me",
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  refreshTokenTtlMs: 7 * 24 * 60 * 60 * 1000,
  clientOrigins,
  exposeResetToken: process.env.EXPOSE_RESET_TOKEN === "true",
};
