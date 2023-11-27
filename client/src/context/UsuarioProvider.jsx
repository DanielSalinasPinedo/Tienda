import { useContext, useState } from "react";
import { CrearUsuarioRequest, DeleteUsuarioRequest, GetUsuariosRequest, GetUsuarioRequest, UpdateUsuarioRequest} from "../services/usuarios.api";
import { UsuarioContext } from "./UsuariosContext";
import { LoginRequest, TokenRequest } from "../services/auth";
import Cookies from "js-cookie";


export const useUsuarios=()=>{
    const contexto=useContext(UsuarioContext);
    if(!contexto) throw new Error('useUsuarios debe ser usado dentro del provider')
    return contexto
}

export const UsuarioContextProvider = ({children})=>{
    const [usuarios,setUsuarios] = useState([])
    const [token,setToken] = useState(Cookies.get('token') ? Cookies.get('token'): null)
    const [auth, setAuth] = useState(false)

    const obtenerUsuarios = async()=>{
        try {
          const response = await GetUsuariosRequest()
          setUsuarios(response.data)
        } catch (error) {
          console.log(error)
        }
    }

    const deleteUsuario = async(id)=>{
        try {
          const response = await DeleteUsuarioRequest(id)
          setUsuarios(usuarios.filter(usuario=>usuario.codigo !== id))
        } catch (error) {
          console.log(error)
        }
    }

    const crearUsuario = async(values)=>{
        try {
            await CrearUsuarioRequest(values);
        } catch (error) {
            console.error("Error en la solicitud:", error.response);
            if(error.response.status == '409'){
                return "El usuario ya se encuentra registrado"
            }
        }
    }

    const obtenerUsuario = async(id)=>{
        try {
            const response = await GetUsuarioRequest(id)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarUsuario = async(id,nuevosCampos)=>{
        try {
            const response = await UpdateUsuarioRequest(id, nuevosCampos)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const login = async(values)=>{
        try {
            const response = (await LoginRequest(values)).data.token
            Cookies.set('token',response)
            setToken(response)
        } catch (error) {   
            if(error.response.status == '401'){
                return 'El usuario o contaseña incorrecto'
            }
        }
    }

    const tokenUsuario = async()=>{
        try {
            var cookieToken = Cookies.get('token')
            if(cookieToken){
                const response = (await TokenRequest(cookieToken)).data.message
                setAuth(response)
                return response
            }
        } catch (error) {
            console.log("tokenUsuario",error)
        }
    }

    return (
        <UsuarioContext.Provider value={{usuarios, setUsuarios, obtenerUsuarios, deleteUsuario, crearUsuario, obtenerUsuario, actualizarUsuario, login, token, tokenUsuario, auth}}>
            {children}
        </UsuarioContext.Provider>
    )
}