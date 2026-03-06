import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { config } from "../config.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export function nowIso() {
  return new Date().toISOString();
}

export function generateId(prefix = "id") {
  return `${prefix}_${nanoid(12)}`;
}

export function generateApiKey() {
  return `sk_live_${crypto.randomBytes(16).toString("hex")}`;
}

export function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
