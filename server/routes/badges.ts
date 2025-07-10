import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/impulses.json");

router.get("/", authenticateToken, (req, res) => {
  const email = (req as any).user.email;

  if (!fs.existsSync(DATA_FILE)) return res.json([]);

  const allData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const userImpulses = allData.filter((entry: any) => entry.user === email);

  const skipped = userImpulses.filter((i: any) => i.status === "skipped");
  const savedAmount = skipped.reduce((sum: number, i: any) => sum + Number(i.price || 0), 0);
  const skippedCount = skipped.length;

  const skippedDates = new Set(
    skipped.map((i: any) => new Date(i.date).toISOString().split("T")[0])
  );

  let maxStreak = 0;
  let currentStreak = 0;
  let day = new Date();

  for (let i = 0; i < 30; i++) {
    const dayStr = day.toISOString().split("T")[0];
    if (skippedDates.has(dayStr)) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    day.setDate(day.getDate() - 1);
  }

  const badges = [
    {
      id: 1,
      name: "First Resistance",
      description: "Resisted your first impulse purchase",
      icon: "🛡️",
      unlocked: skippedCount >= 1,
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Resisted purchases for 7 days straight",
      icon: "⚔️",
      unlocked: maxStreak >= 7,
    },
    {
      id: 3,
      name: "Money Saver",
      description: "Saved ₹10,000 in a month",
      icon: "💰",
      unlocked: savedAmount >= 10000,
    },
    {
      id: 4,
      name: "Discipline Master",
      description: "Resisted 50 impulse purchases",
      icon: "🏆",
      unlocked: skippedCount >= 50,
    },
  ];

  res.json(badges);
});

export default router;
