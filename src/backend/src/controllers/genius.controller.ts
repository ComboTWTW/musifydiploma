import { type Request, type Response } from "express";
import { searchSongAndGetLyrics } from "../services/genius.service.js";

export const getLyrics = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            return res.status(400).json({
                error: "Missing query",
            });
        }

        const data = await searchSongAndGetLyrics(query);

        return res.json(data);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to fetch lyrics",
        });
    }
};
