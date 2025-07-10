import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.ts";
import protectedRoutes from "./routes/protected.ts";
import decisionsRoutes from "./routes/decisions.ts";
import impulseRoutes from "./routes/impulses.ts";
import summaryRoutes from "./routes/summary.ts";
import statsRoutes from "./routes/stats.ts";
import wishlistRoutes from "./routes/wishlist.ts";
import badgesRoutes from "./routes/badges.ts"; 

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api", protectedRoutes);
  app.use("/api/summary", summaryRoutes);
  app.use("/api/stats", statsRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/decisions", decisionsRoutes);
  app.use("/api/impulses", impulseRoutes);
  app.use("/api/badges", badgesRoutes);

  app.get("/api/test", (_req, res) => {
    res.json({ message: "Server is working!" });
  });

  return app;
}
