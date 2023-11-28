import React, { useEffect, useState } from 'react'
import { useProductos } from '../context/ProductProvider.jsx'
import Swal from 'sweetalert2';
import { useVentas } from '../context/VentaProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../context/UsuarioProvider.jsx';
import * as jwt from 'jwt-decode';
import { format } from 'date-fns';

const Carrito = () => {
    const { obtenerProductos, productos } = useProductos()
    const { obtenerVentas, crearVenta, ventas } = useVentas()
    const { token, usuarios, obtenerUsuarios } = useUsuarios()
    const navigate = useNavigate()

    useEffect(()=>{
        obtenerProductos()
        obtenerVentas()
        obtenerUsuarios()
    },[])

    const codigoUser = jwt.jwtDecode(token).user.id
    
    const [carrito, setCarrito] = useState(() => {
        const carrito = localStorage.getItem('carrito');
        return carrito ? JSON.parse(carrito) : [];
    })

    const handleToButton = async() => {
        carrito.map((producto)=>{
            crearVenta(producto)
            localStorage.setItem('carrito', []);
            Swal.fire({
                icon: 'success',
                title: 'Producto comprado',
                text: 'El producto ha sido comprado con exitosamente',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/tienda")
                }
            })
        })
    }

    const decrementarCantidad = (codigo)=>{
        const precioProducto = productos.map((product)=>
            codigo == product.codigo ?
                product.precio : 0
        ).filter((precio) => precio !== 0);
        
        const nuevoCarrito = carrito.map((producto) => {
            const codigoProducto = producto.codigo_producto;
            const cantidadVendida = producto.cantidad_vendida;            
            
            if (cantidadVendida > 1) {
                if(codigoProducto == codigo){
                    return {
                        ...producto,
                        cantidad_vendida: cantidadVendida - 1,
                        total_venta: (cantidadVendida - 1) * precioProducto,
                    };
                }
                else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error',
                        text: 'ERROR',
                        allowOutsideClick: false,
                    });
                }
            } else {        
                if(producto.codigo_producto != codigo){
                    return producto
                }
            }
        }).filter((producto) => producto != null)
        
        setCarrito(nuevoCarrito);

        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    }

    const incrementarCantidad = (codigo)=>{
        const precioProducto = productos.map((product)=>
            codigo == product.codigo ?
                product.precio : 0
        ).filter((precio) => precio !== 0);
        
        const nuevoCarrito = carrito.map((producto) => {
            const codigoProducto = producto.codigo_producto;
            const cantidadVendida = producto.cantidad_vendida;
            
            // Obtener el stock del producto correspondiente
            const stockProducto = productos
                .filter((product) => codigoProducto === codigo)
                .map((product) => product.stock)[0];
            
            // Verificar si la cantidad vendida es menor al stock
            if (codigoProducto === codigo) {
                if(cantidadVendida < stockProducto){
                    return {
                        ...producto,
                        cantidad_vendida: cantidadVendida + 1,
                        total_venta: (cantidadVendida + 1) * precioProducto,
                    };
                }
                else{
                    // Mostrar la alerta cuando la condición es falsa
                    Swal.fire({
                        icon: 'warning',
                        title: 'El producto ya no tiene más stock',
                        text: 'No hay más stock disponible',
                        allowOutsideClick: false,
                    });
                    return producto;
                }
            } else {        
                // Devolver el producto sin cambios
                return producto
            }
        });

        console.log(nuevoCarrito)
        
        setCarrito(nuevoCarrito);

        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    }

    return (
        <div className='container mt-3'>
            <div className='row mb-3'>
            {carrito.length > 0 ? carrito.map((producto, index)=>(
                    <div key={index} className='col-3'>
                        <div className='card mb-4 shadow zoom-on-hover'>
                            <div className='card-header d-flex justify-content-between'>
                                <h4>{productos.map((product)=>
                                    producto.codigo_producto == product.codigo ?
                                        product.nombre : ''                                    
                                )}</h4>
                                <p>{productos.map((product)=>
                                    producto.codigo_producto == product.codigo ?
                                        product.stock : ''                                    
                                )}</p>
                            </div>
                            <div className='card-body'>
                                <p>{producto.descripcion}</p>
                                <div className='d-flex justify-content-between'>
                                    <p>${producto.total_venta}</p>
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => decrementarCantidad(producto.codigo_producto)}
                                    >
                                        -
                                    </button>
                                    <p className='mx-2'>{producto.cantidad_vendida}</p>
                                    <button
                                        className='btn btn-primary'
                                        onClick={() => incrementarCantidad(producto.codigo_producto)}
                                    >
                                        +
                                    </button>                                  
                                </div>
                            </div>
                        </div>
                        <button
                            className='btn btn-success fixed-bottom mb-3'
                            onClick={()=>handleToButton()}
                        >
                            Finalizar compra
                        </button>
                    </div>
                )) : <div className='mt-5 text-center'><h2>No ha añadido productos al carrito</h2></div>}
            </div>
            <hr className='my-5'/>
            <div>
            <h2 className='text-center my-5'>Productos Comprados</h2>
            {ventas.length > 0 ? ventas
                .filter(venta => venta.codigo_cliente == codigoUser)
                .map((venta, index)=>(
                <div key={index}>
                    <div className='card mb-4 shadow zoom-on-hover'>
                        <div className='card-header'>
                            <div className='float-end'>
                                <p>{usuarios.map((user)=>
                                        venta.codigo_cliente == user.codigo ?
                                            user.usuario : ''
                                )}</p>
                            </div>
                            <div className='d-flex justify-content-around'>
                                <h4>{productos.map((product)=>
                                    venta.codigo_producto == product.codigo ?
                                        product.nombre : ''                                    
                                )}</h4>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='d-flex justify-content-around'>
                                <p>Cantidad: {venta.cantidad_vendida}</p>
                                <p>Precio: ${venta.total_venta}</p>                                
                            </div>
                            <div className='d-flex justify-content-end'>
                                <p>{
                                    format(new Date(venta.fecha_venta), 'dd/MM/yyyy HH:mm:ss', { timeZone: 'America/New_York' })
                                }</p>
                            </div>
                        </div>
                    </div>
                </div>
            )):<div className='mt-5 text-center'><h2>No ha productos comprados</h2></div>}
            </div>
        </div>
    )
}

export default Carrito