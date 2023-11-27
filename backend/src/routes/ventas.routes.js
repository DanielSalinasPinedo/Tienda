import { Router } from "express";
import { createVenta, deleteVenta, getVenta, getVentas, updateVenta } from "../controllers/ventas.controller.js";

const router = Router();

router.get('/sales', getVentas)
router.get('/sales/:codigo', getVenta)
router.post('/sales', createVenta)
router.patch('/sales/:codigo', updateVenta)
router.delete('/sales/:codigo', deleteVenta)

export default router