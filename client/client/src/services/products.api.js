import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3005"

export const CrearProductoRequest=async(producto)=>await axios.post(`${URL}/api/products`, producto)
export const GetProductosRequest=async()=>await axios.get(`${URL}/api/products`)
export const DeleteProductoRequest=async(id)=>await axios.delete(`${URL}/api/products/${id}`)
export const GetProductoRequest=async(id)=>await axios.get(`${URL}/api/products/${id}`)
export const UpdateProductoRequest=async(id,nuevosCampos) => await axios.patch(`${URL}/api/products/${id}`,nuevosCampos)