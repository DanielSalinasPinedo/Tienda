import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3005"

export const CrearUsuarioRequest=async(usuario)=>await axios.post(`${URL}/api/usuarios`, usuario)
export const GetUsuariosRequest=async()=>await axios.get(`${URL}/api/usuarios`)
export const DeleteUsuarioRequest=async(id)=>await axios.delete(`${URL}/api/usuarios/${id}`)
export const GetUsuarioRequest=async(id)=>await axios.get(`${URL}/api/usuarios/${id}`)
export const UpdateUsuarioRequest=async(id,nuevosCampos) => await axios.patch(`${URL}/api/usuarios/${id}`,nuevosCampos)