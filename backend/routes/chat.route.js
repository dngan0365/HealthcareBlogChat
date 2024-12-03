import express from "express"
import { createNewChat, getChatItem, getChatPage, putQuestion } from "../controllers/chat.controller.js"

const router = express.Router()

router.post("/", createNewChat);
router.get("/userchats", getChatPage);
router.get("/:chatId", getChatItem);
router.put("/:chatId", putQuestion)


export default router 