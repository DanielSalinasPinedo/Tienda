import { useContext, useState } from "react";
import { CrearProductoRequest, DeleteProductoRequest, GetProductoRequest, GetProductosRequest, UpdateProductoRequest } from "../services/products.api";
import { ProductContext } from "./ProductsContext";

export const useProductos=()=>{
    const contexto=useContext(ProductContext);
    if(!contexto) throw new Error('useProductos debe ser usado dentro del provider')
    return contexto
}

export const ProductContextProvider = ({children})=>{
    const [productos,setProductos] = useState([])

    const obtenerProductos = async()=>{
        try {
          const response = await GetProductosRequest()
          setProductos(response.data)
        } catch (error) {
          console.log(error)
        }
    }

    const deleteProducto = async(id)=>{
        try {
          const response = await DeleteProductoRequest(id)
          setProductos(productos.filter(producto => producto.codigo !== id))
        } catch (error) {
          console.log(error)
        }
    }

    const crearProducto = async(values)=>{
        try {
            await CrearProductoRequest(values);
        } catch (error) {
            console.error("Error en la solicitud:", error.response);
            if(error.response.status == '409'){
                return "El producto ya se encuentra registrado"
            }
        }
    }

    const obtenerProducto = async(id)=>{
        try {
            const response = await GetProductoRequest(id)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarProducto = async(id,nuevosCampos)=>{
        try {
            const response = await UpdateProductoRequest(id, nuevosCampos)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ProductContext.Provider value={{ productos, setProductos, obtenerProductos, deleteProducto, crearProducto, obtenerProducto, actualizarProducto }}>
            {children}
        </ProductContext.Provider>
    )
}