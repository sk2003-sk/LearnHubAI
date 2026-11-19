import { Router } from "express";

const router = Router();

const info = {
  status: "ok",
  service: "LearnHub API",
  version: "1.0.0",
};

router.get("/", (req, res) => res.json(info));
router.get("/test", (req, res) => res.json({ ...info, message: "API is healthy." }));

router.get("/api-docs.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: { title: "LearnHub API", version: info.version },
    servers: [{ url: "/api/v1" }],
    paths: {
      "/auth/login": { post: { summary: "Log in with email and password" } },
      "/auth/register": { post: { summary: "Register a new account" } },
      "/auth/me": { get: { summary: "Get the signed-in user" } },
      "/lms/courses": { get: { summary: "List published courses" } },
      "/lms/my-learning": { get: { summary: "List the user's enrolled courses" } },
    },
  });
});

export default router;
