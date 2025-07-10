import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authenticateToken } from "../middleware/auth.ts"; // ✅ Named import

// Extend Express Request type to include 'user'
declare module "express-serve-static-core" {
  interface Request {
    user?: { email: string };
  }
}

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FILE = path.join(__dirname, "../data/impulses.json");

// ✅ GET all impulses for the logged-in user
router.get("/", authenticateToken, (req, res) => {
  try {
    if (!fs.existsSync(FILE)) {
      return res.json([]); // Return empty array if file doesn't exist
    }

    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

    // 🔐 Only return impulses for the authenticated user
    const filtered = data.filter((entry: any) => entry.user === req.user.email);

    res.json(filtered);
  } catch (err) {
    console.error("❌ Failed to load impulses:", err);
    res.status(500).json({ message: "Failed to load impulses" });
  }
});

// ✅ POST a new impulse decision (with user)
router.post("/", authenticateToken, (req, res) => {
  const { item, price, status, regretRating, date } = req.body;

  if (!item || !price || !status || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newEntry = {
    item,
    price,
    status,
    regretRating,
    date,
    user: req.user.email, // 🔐 Save user's email
  };

  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  }

  data.push(newEntry);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.status(201).json({ message: "Entry added", entry: newEntry });
});

export default router;
