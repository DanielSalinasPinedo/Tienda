import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3005"

export const CrearVentaRequest=async(sale)=>await axios.post(`${URL}/api/sales`, sale)
export const GetVentasRequest=async()=>await axios.get(`${URL}/api/sales`)
export const DeleteVentaRequest=async(id)=>await axios.delete(`${URL}/api/sales/${id}`)
export const GetVentaRequest=async(id)=>await axios.get(`${URL}/api/sales/${id}`)
export const UpdateVentaRequest=async(id,nuevosCampos) => await axios.patch(`${URL}/api/sales/${id}`,nuevosCampos)