import { pool } from "../db.js"
import jwt  from "jsonwebtoken";

var token = null

export const getUsuario = async(req, res) => {
    const codigo = req.params.codigo
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE codigo =?',[codigo])
        if(rows.length <= 0) return res.status(404).json({
            message: 'El usuario no existe'
        })
        res.send(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error'
        })
    }
}

export const getUsuarios = async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios')
        if(rows.length <= 0) return res.status(404).json({
            message: 'No hay usuarios registrados'
        })
        res.send(rows)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const auth = async(req, res) => {
    const {tokenCookie} = req.body
    try {
        if (tokenCookie === token && tokenCookie){
            return res.status(200).json({
                message: true
            })
        }
        token = null
        return res.status(401).json({
            message: false
        })
    } catch (error) {
        return res.status(404).json({
            message: 'expirado ' + req.body
        })
    }
}

export const login = async(req, res) => {
    const {usuario, password} = req.body 
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario =? AND password =?',[usuario,password])
        if(rows.length <= 0){
            return res.status(401).json({
                message: 'Usuario o contraseña incorrecto, intente nuevamente'
            })
        }
        else if(rows.length === 1){
            const user = {
                id: rows[0].codigo,
                usuario: rows[0].usuario,
                rol: rows[0].rol,
            };

            token = jwt.sign({ user }, "secretkey");

            res.status(200).json({ token });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error del servidor intente mas tarde'
        })        
    }
}

export const createUsuario = async(req, res) =>{
    const {usuario, password, rol} = req.body
    try {
        const [result] = await pool.query('SELECT * FROM usuarios WHERE usuario=?',[usuario])
        if(result.length > 0) return res.status(409).json({
            message: 'Usuarios ya existe'
        })

        const [rows] = await pool.query('INSERT INTO usuarios (usuario,password,rol) VALUES (?,?,?)',[usuario, password, rol])
        res.send({
            codigo:rows.insertId,usuario,password,rol,result
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateUsuario = async(req, res) => {
    const {codigo} = req.params
    const {usuario, password, rol} = req.body

    try {
        const [result] = await pool.query('UPDATE usuarios SET usuario=IFNULL(?,usuario),password=IFNULL(?,password),rol=IFNULL(?,rol) WHERE codigo=?',[usuario,password,rol,codigo])

        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuarios no encontrado'
        })

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE codigo=?',[codigo])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deleteUsuario = async(req, res) => {
    const codigo = req.params.codigo
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE codigo=?',[codigo])
        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuario no encontrado'
        })
        res.send(204)
    } catch (error) {
        return res.status(500).json({message: error.message + ' no se puede eliminar'})
    }
}