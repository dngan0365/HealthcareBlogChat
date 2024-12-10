import express from "express"
import { getUser, editUser } from "../controllers/profile.controller.js"

const router = express.Router()

router.get("/", getUser)
router.patch("/", editUser)

export default router 