import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../types/auth";

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


export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      full_name: true,
      mobile_number: true,
      aadhar_number: true,
      role: true,
      district: true,
      created_at: true,
    },
  });

  res.json(user);
};




export const updateDistrict = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { district } = req.body;

    if (!district || typeof district !== "string") {
      return res.status(400).json({ message: "District is required" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { district },
      select: {
        id: true,
        full_name: true,
        district: true,
        role: true,
      },
    });

    res.json({
      message: "District updated successfully",
      user,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};