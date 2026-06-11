import { Router } from "express";
import { getLyrics } from "../controllers/genius.controller.js";

const router = Router();

router.get("/lyrics", getLyrics);

export default router;
