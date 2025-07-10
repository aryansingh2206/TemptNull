import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();

router.get("/dashboard", authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Welcome, ${user.email}!` });
});

export default router;
