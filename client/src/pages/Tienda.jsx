import React, { useEffect, useState } from 'react'
import { useProductos } from '../context/ProductProvider.jsx'
import Swal from 'sweetalert2';
import { useUsuarios } from '../context/UsuarioProvider.jsx'
import * as jwt from 'jwt-decode';

const Tienda = () => {
    const { productos, obtenerProductos, obtenerProducto } = useProductos()
    const { token } = useUsuarios()
    const [productoFiltrado, setProductoFiltrado] = useState()

    const [carrito, setCarrito] = useState(() => {
        const carrito = localStorage.getItem('carrito');
        return carrito ? JSON.parse(carrito) : [];
    });

    useEffect(()=>{
        obtenerProductos()
    },[])

    
    
    const handleAddToCart = async(codigo) => {
        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.find((item) => item.codigo_producto == codigo);

        if (productoEnCarrito) {
            Swal.fire({
                icon: 'info',
                title: 'Producto ya en el carrito',
                text: 'Este producto ya está en tu carrito',
                allowOutsideClick: false,
            });
        } else {
            // Si el producto no está en el carrito, agregarlo
            const producto = productos.find((item) => item.codigo === codigo);
            if (producto) {
                const response = carrito

                const temp = await obtenerProducto(codigo)

                setProductoFiltrado(temp)

                const tokenDecode = jwt.jwtDecode(token).user.id
                
                response.push({
                    codigo_producto: codigo,
                    codigo_cliente: tokenDecode,
                    cantidad_vendida: 1,
                    total_venta: parseFloat(temp.precio),
                })
                
                setCarrito(response)
                localStorage.setItem('carrito', JSON.stringify(response));
                Swal.fire({
                    icon: 'success',
                    title: 'Añadido',
                    text: 'El producto ha sido añadido con exito',
                });
            }
        }
    };

    return (
        <div className='container mt-3'>
            <div className='row mb-3'>
                {productos
                .filter(producto => producto.stock > 0)
                .map((producto, index)=>(
                    <div key={index} className='col-3'>
                        <div className='card mb-4 shadow zoom-on-hover'>
                            <div className='card-header d-flex justify-content-between'>
                                <h4>{producto.nombre}</h4>
                                <p>{producto.stock}</p>
                            </div>
                            <div className='card-body'>
                                <p>{producto.descripcion}</p>
                                <div className='d-flex justify-content-between'>
                                    <p>${producto.precio}</p>
                                    <button
                                        type="button"
                                        className='btn btn-success'
                                        onClick={() => handleAddToCart(producto.codigo)}
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tienda