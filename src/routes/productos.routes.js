import { Router } from "express";
import { createProducto, deleteProducto, getProductos, updateProducto, getProducto } from "../controllers/productos.controller.js";

const router = Router();

router.get('/products', getProductos)
router.get('/products/:codigo', getProducto)
router.post('/products', createProducto)
router.patch('/products/:codigo', updateProducto)
router.delete('/products/:codigo', deleteProducto)

export default router