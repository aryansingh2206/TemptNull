import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FILE_PATH = path.join(__dirname, "../data/decisions.json");

// Helper to read data
function readDecisions() {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// GET all decisions
router.get("/", (req, res) => {
  const data = readDecisions();
  res.json(data);
});

// POST new decision
router.post("/", (req, res) => {
  const { item, price, status, regretRating } = req.body;
  const decisions = readDecisions();
  const newEntry = {
    id: Date.now().toString(),
    item,
    price,
    status,
    regretRating,
    date: new Date().toISOString().split("T")[0]
  };
  decisions.push(newEntry);
  fs.writeFileSync(FILE_PATH, JSON.stringify(decisions, null, 2));
  res.json({ message: "Decision added!", entry: newEntry });
});

export default router;
