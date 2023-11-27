import express, { json, response } from "express";
import productosRoutes from './routes/productos.routes.js'
import ventasRoutes from './routes/ventas.routes.js'
import usuariosRoutes from './routes/usuarios.router.js'
import indexRoutes from './routes/index.routes.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api',productosRoutes)
app.use('/api',usuariosRoutes)
app.use('/api',ventasRoutes)
app.use(indexRoutes)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    })
})

app.get('/', (req, res) =>{
    res.send("Hola desde express")
})

export default app