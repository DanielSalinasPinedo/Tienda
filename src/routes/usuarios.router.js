import { Router } from "express";
import { auth, createUsuario, deleteUsuario, getUsuario, getUsuarios, login, updateUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

router.get('/usuarios', getUsuarios)
router.get('/usuarios/:codigo', getUsuario)
router.post('/usuarios', createUsuario)
router.patch('/usuarios/:codigo', updateUsuario)
router.delete('/usuarios/:codigo', deleteUsuario)
router.post('/login', login)
router.post('/auth', auth)

export default router