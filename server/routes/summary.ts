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

router.get("/", authenticateToken, (req, res) => {
  try {
    const email = (req as any).user.email;

    if (!fs.existsSync(FILE)) {
      return res.json({
        totalSaved: 0,
        totalHours: 0,
        totalImpulses: 0,
        avgRegret: "0.0",
      });
    }

    const data = JSON.parse(fs.readFileSync(FILE, "utf-8")).filter(
      (entry: any) => entry.user === email
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = data.filter((entry: any) => {
      const d = new Date(entry.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

   

    // Clean status values to avoid whitespace/case bugs
    const skippedThisMonth = thisMonth.filter(
      (e: any) => String(e.status).trim().toLowerCase() === "skipped"
    );

    const totalSaved = skippedThisMonth.reduce(
      (acc: number, e: any) => acc + parseFloat(e.price),
      0
    );

    const totalHours = Math.round(totalSaved / 2000); // placeholder formula
    const totalImpulses = skippedThisMonth.length;

    const regretRated = thisMonth.filter(
      (e: any) =>
        String(e.status).trim().toLowerCase() === "bought" &&
        e.regretRating !== null &&
        e.regretRating !== undefined &&
        !isNaN(parseFloat(e.regretRating))
    );

    const avgRegret =
      regretRated.reduce(
        (sum: number, e: any) => sum + parseFloat(e.regretRating),
        0
      ) / (regretRated.length || 1);

    res.json({
      totalSaved,
      totalHours,
      totalImpulses,
      avgRegret: avgRegret.toFixed(1),
    });
  } catch (err) {
    console.error("❌ Summary fetch error:", err);
    res.status(500).json({ message: "Failed to generate summary" });
  }
});

export default router;
