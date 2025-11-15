import express from "express";
import { matchBuyers } from "../controllers/buyerController.js";

const router = express.Router();

router.get("/matching", matchBuyers);

export default router;
