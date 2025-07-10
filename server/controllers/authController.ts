import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readUsers, writeUsers } from "../utils/file";
import { User } from "../types/user";
import { v4 as uuidv4 } from "uuid";

const SECRET = "your-secret"; // Replace with process.env.SECRET in real setup

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = readUsers();

  const existing = users.find((u: User) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: User = {
    id: uuidv4(),
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({ message: "User registered successfully." });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u: User) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "2h",
  });

  return res.json({ token });
};
