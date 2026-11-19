import app from "./app.js";
import { config } from "./config.js";
import { connectDatabase } from "./db.js";

async function start() {
  await connectDatabase();

  if (config.seedOnStart) {
    try {
      const { seed } = await import("./seed.js");
      await seed({ connect: false, disconnect: false });
    } catch (error) {
      console.error("[seed] startup seed failed", error);
    }
  }

  app.listen(config.port, () => {
    console.log(`[api] LearnHub API listening on port ${config.port}`);
    console.log(`[api] allowed origins: ${config.clientOrigins.join(", ")}`);
  });
}

start().catch((error) => {
  console.error("[api] failed to start", error);
  process.exit(1);
});
