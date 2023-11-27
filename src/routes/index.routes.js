import { Router } from "express";
import { prueba } from "../controllers/index.controller.js";

const router = Router()

router.get('/prueba', prueba)

export default router