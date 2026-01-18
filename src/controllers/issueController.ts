import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// CREATE
export const createIssue = async (req: Request, res: Response) => {
    try {
      const { description, location, type, userId } = req.body;
  
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;
  
      const photo = files?.photo?.[0]?.path || null;
      const video = files?.video?.[0]?.path || null;
  
      const issue = await prisma.issueReport.create({
        data: {
          description,
          location,
          type,
          photo,
          video,
          user: {
            connect: { id: Number(userId) },
          },
        },
      });
  
      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ error: "Failed to create issue" });
    }
  };
  
  

// READ ALL
export const getIssues = async (_req: Request, res: Response) => {
  try {
    const issues = await prisma.issueReport.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

// READ BY ID
export const getIssueById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const issue = await prisma.issueReport.findUnique({
      where: { id },
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issue" });
  }
};

// UPDATE
export const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { description, location, type, photo, video } = req.body;

    const issue = await prisma.issueReport.update({
      where: { id },
      data: {
        description,
        location,
        type,
        photo,
        video,
      },
    });

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue" });
  }
};

// DELETE
export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.issueReport.delete({
      where: { id },
    });

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete issue" });
  }
};

export const getIssuesByUserId = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
  
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
      }
  
      const issues = await prisma.issueReport.findMany({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              mobile_number: true,
              district: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      res.json(issues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch issues by user" });
    }
  };
