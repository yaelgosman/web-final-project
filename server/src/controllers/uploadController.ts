import { Request, Response } from "express";

export const uploadFile = (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const base = `http://${process.env.DOMAIN_BASE}:${process.env.PORT}/`;
  const fileName = req.file.filename;

  const url = base + "uploads/" + fileName;

  res.status(200).json({ url });
};
