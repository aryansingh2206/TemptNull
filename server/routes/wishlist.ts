import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FILE = path.join(__dirname, "../data/wishlist.json");

// Type-safe wishlist item
interface WishlistItem {
  id: string;
  user: string;
  item: string;
  price: number;
  date: string;
}

// Load wishlist.json
const loadData = (): WishlistItem[] => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
};

// Save to wishlist.json
const saveData = (data: WishlistItem[]) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

// GET /api/wishlist
router.get("/", authenticateToken, (req, res) => {
  const email = (req as any).user.email;
  const data = loadData();
  const userItems = data.filter((item) => item.user === email);
  res.json(userItems);
});

// POST /api/wishlist
router.post("/", authenticateToken, (req, res) => {
  const email = (req as any).user.email;
  const { item, price } = req.body;

  if (!item || isNaN(price)) {
    return res.status(400).json({ message: "Valid item and price required" });
  }

  const newItem: WishlistItem = {
    id: Date.now().toString(),
    user: email,
    item,
    price: parseFloat(price),
    date: new Date().toISOString(),
  };

  const data = loadData();
  data.push(newItem);
  saveData(data);

  res.status(201).json(newItem);
});

// DELETE /api/wishlist/:id
router.delete("/:id", authenticateToken, (req, res) => {
  const email = (req as any).user.email;
  const id = req.params.id;
  let data = loadData();

  const originalLength = data.length;
  data = data.filter((item) => !(item.user === email && item.id === id));

  if (data.length === originalLength) {
    return res.status(404).json({ message: "Item not found" });
  }

  saveData(data);
  res.status(200).json({ message: "Item deleted" });
});

// (Optional) PUT /api/wishlist/:id → Edit an item
// PUT /api/wishlist/:id → update item
router.put("/:id", authenticateToken, (req, res) => {
  const email = (req as any).user.email;
  const id = req.params.id;
  const { item, price } = req.body;

  if (!item || !price) {
    return res.status(400).json({ message: "Item name and price are required" });
  }

  let data = loadData();
  const index = data.findIndex((entry) => entry.user === email && entry.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  data[index] = {
    ...data[index],
    item,
    price,
    date: new Date().toISOString(),
  };

  saveData(data);
  res.status(200).json(data[index]);
});


export default router;
