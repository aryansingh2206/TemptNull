import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FILE = path.join(__dirname, "../data/impulses.json");

// 📊 GET /api/stats/regret-trend
router.get("/regret-trend", authenticateToken, (req, res) => {
  try {
    const email = (req as any).user.email;

    if (!fs.existsSync(FILE)) {
      return res.json([]);
    }

    const rawData = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const userEntries = rawData.filter((e: any) => e.user === email);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = userEntries.filter((e: any) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Group by date (YYYY-MM-DD) and average regret for "bought"
    const dailyRegretMap: Record<string, number[]> = {};

    thisMonth.forEach((e: any) => {
      if (e.status !== "bought" || e.regretRating === null || e.regretRating === undefined) return;

      const dateKey = new Date(e.date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      if (!dailyRegretMap[dateKey]) dailyRegretMap[dateKey] = [];
      dailyRegretMap[dateKey].push(parseFloat(e.regretRating));
    });

    const trend = Object.entries(dailyRegretMap).map(([date, ratings]) => ({
      date,
      averageRegret: (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1),
    }));

    res.json(trend);
  } catch (err) {
    console.error("❌ Failed to fetch regret trend:", err);
    res.status(500).json({ message: "Could not fetch regret trend" });
  }
});

// 📈 GET /api/stats/skipped-vs-bought
router.get("/skipped-vs-bought", authenticateToken, (req, res) => {
  try {
    const email = (req as any).user.email;

    if (!fs.existsSync(FILE)) {
      return res.json({ labels: ["Bought", "Skipped"], data: [0, 0] });
    }

    const rawData = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const userEntries = rawData.filter((e: any) => e.user === email);

    let boughtCount = 0;
    let skippedCount = 0;

    userEntries.forEach((e: any) => {
      if (e.status === "bought") boughtCount++;
      else if (e.status === "skipped") skippedCount++;
    });

    res.json({
      labels: ["Bought", "Skipped"],
      data: [boughtCount, skippedCount],
    });
  } catch (err) {
    console.error("❌ Failed to fetch skipped vs bought stats:", err);
    res.status(500).json({ message: "Could not fetch skipped vs bought stats" });
  }
});

export default router;
