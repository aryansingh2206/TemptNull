import fs from "fs";
import path from "path";

const USERS_PATH = path.join(__dirname, "../data/users.json");

export const readUsers = (): any[] => {
  const data = fs.readFileSync(USERS_PATH, "utf-8");
  return JSON.parse(data || "[]");
};

export const writeUsers = (users: any[]) => {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
};
