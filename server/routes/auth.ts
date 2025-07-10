import { Router } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = Router();

// ✅ Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Path to users.json
const USERS_FILE = path.join(__dirname, "../data/users.json");

// 🔐 Secret key for JWT
const JWT_SECRET = "your-secret-key"; // 🔒 Replace with env var in production

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login request:", { email });

  const usersRaw = fs.readFileSync(USERS_FILE, "utf-8");
  const users = JSON.parse(usersRaw);

  const user = users.find((u: any) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ token });
});

// 📝 REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("📝 Register request:", { email });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const usersRaw = fs.existsSync(USERS_FILE)
    ? fs.readFileSync(USERS_FILE, "utf-8")
    : "[]";
  const users = JSON.parse(usersRaw);

  const userExists = users.find((u: any) => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("✅ User registered:", email);

  const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ token });
});

export default router;
