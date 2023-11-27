import { useContext, useState } from "react";
import { VentaContext } from "./VentasContext";
import { CrearVentaRequest, DeleteVentaRequest, GetVentaRequest, GetVentasRequest, UpdateVentaRequest } from "../services/venta.api";


export const useVentas=()=>{
    const contexto=useContext(VentaContext);
    if(!contexto) throw new Error('useVentas debe ser usado dentro del provider')
    return contexto
}

export const VentaContextProvider = ({children})=>{
    const [ventas,setVentas] = useState([])

    const obtenerVentas = async()=>{
        try {
          const response = await GetVentasRequest()
          setVentas(response.data)
        } catch (error) {
          console.log(error)
        }
    }

    const deleteVenta = async(id)=>{
        try {
          const response = await DeleteVentaRequest(id)
          setVentas(ventas.filter(venta=>venta.codigo !== id))
        } catch (error) {
          console.log(error)
        }
    }

    const crearVenta = async(values)=>{
        try {
            await CrearVentaRequest(values);
        } catch (error) {
            console.error("Error en la solicitud:", error.response);
            if(error.response.status == '404'){
                return "El producto que desea comprar no esta registrado"
            }
        }
    }

    const obtenerVenta = async(id)=>{
        try {
            const response = await GetVentaRequest(id)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarVenta = async(id,nuevosCampos)=>{
        try {
            const response = await UpdateVentaRequest(id, nuevosCampos)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <VentaContext.Provider value={{ventas, setVentas, obtenerVenta, deleteVenta, crearVenta, obtenerVentas, actualizarVenta}}>
            {children}
        </VentaContext.Provider>
    )
}