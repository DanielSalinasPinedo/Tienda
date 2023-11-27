import { pool } from "../db.js"

export const getVentas = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ventas')
        if(rows.length <= 0) return res.status(404).json({
            message: 'No hay ventas disponibles'
        })
        res.send(rows)
    } catch (error) {
        return res.status(500).json({message: 'Ha ocurrido un error'})
    }
}

export const getVenta = async(req, res) => {
    const codigo = req.params.codigo
    try {
        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo =?',[codigo])
        if(rows.length <= 0) return res.status(404).json({
            message: 'Venta no registrada'
        })
        res.send(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error'
        })
    }
}

export const createVenta = async (req, res) => {
    const { codigo_producto, codigo_cliente, cantidad_vendida, total_venta } = req.body
    try {
        const [result] = await pool.query('SELECT * FROM productos WHERE codigo=?', [codigo_producto])
        if (result.length <= 0) {
            return res.status(404).json({
                message: 'El producto que desea ingresar no esta registrado'
            })
        }

        for (let i = 0; i < result.length; i++){
            let product = result[i];
            let stock = product.stock - cantidad_vendida
            const [rest] = await pool.query('UPDATE productos SET stock=IFNULL(?,stock) WHERE codigo=?',[stock,codigo_producto])
            if(rest.affectedRows <= 0) return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        const [rows] = await pool.query('INSERT INTO ventas (codigo_producto, codigo_cliente, cantidad_vendida, total_venta) VALUES (?, ?, ?, ?)', [codigo_producto, codigo_cliente, cantidad_vendida, total_venta])

        const [rows2] = await pool.query('SELECT * FROM ventas WHERE codigo=?', [rows.insertId])

        res.send({
            codigo: rows.insertId,
            codigo_producto,
            codigo_cliente,
            fecha_venta: rows2[0].fecha_venta,
            cantidad_vendida,
            total_venta: rows2[0].total_venta
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateVenta = async(req, res) => {
    const {codigo} = req.params
    const {cantidad_vendida, total_venta} = req.body

    try {
        const [result] = await pool.query('UPDATE ventas SET nombre_cliente=IFNULL(?,nombre_cliente),telefono_cliente=IFNULL(?,telefono_cliente),fecha_venta=IFNULL(?,fecha_venta),cantidad_vendida=IFNULL(?,cantidad_vendida),total_venta=IFNULL(?,total_venta) WHERE codigo=?',[cantidad_vendida,total_venta,codigo])

        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'Venta no encontrada'
        })

        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo=?',[codigo])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deleteVenta = async(req, res) => {
    const codigo = req.params.codigo
    try {
        const [result] = await pool.query('DELETE FROM ventas WHERE codigo=?',[codigo])
        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'Venta no encontrada'
        })
        res.send(204)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}