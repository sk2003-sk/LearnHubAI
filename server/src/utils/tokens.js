import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const REFRESH_COOKIE = "learnhub_refresh";

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, type: "access" },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenTtl },
  );
}

export function signRefreshToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: String(user._id), type: "refresh", jti },
    config.refreshTokenSecret,
    { expiresIn: config.refreshTokenTtl },
  );
  return { token, jti };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshTokenSecret);
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax",
    path: "/api/v1/auth",
    maxAge: config.refreshTokenTtlMs,
  };
}

export function clearRefreshCookieOptions() {
  // eslint-disable-next-line no-unused-vars
  const { maxAge, ...options } = refreshCookieOptions();
  return options;
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function activationCode() {
  return String(crypto.randomInt(100000, 999999));
}

export function resetTokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
