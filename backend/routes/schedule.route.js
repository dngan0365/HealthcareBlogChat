// routes/zooEvent.router.js
import express from "express";
import { getAllEvents, batchUpdateEvents } from "../controllers/schedule.controller.js";

const router = express.Router();

// Route to fetch all zoo events for a specific user
router.get("/", getAllEvents);

// Route for batch updates (add, update, delete) for a specific user
router.post("/batch", batchUpdateEvents);

export default router;
