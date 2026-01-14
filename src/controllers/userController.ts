import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { ...rest, password: hashed },
    });

    res.status(201).json({
      message: "User created",
      user: { ...user, password: undefined },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// Get all users
export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "User deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { mobile_number, password } = req.body;

    const user = await prisma.user.findUnique({ where: { mobile_number } });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in",
      token,
      user: { ...user, password: undefined },
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const signoutUser = (_: Request, res: Response) => {
  res.json({ message: "Signed out (client should delete token)" });
};

