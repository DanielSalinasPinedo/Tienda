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

    const handleToButton = async () => {
        const confirmPurchase = await Swal.fire({
            title: '¿Estás seguro de realizar la compra?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro',
            allowOutsideClick: false,
        });
    
        if (confirmPurchase.isConfirmed) {
            // Realizar la compra
            carrito.forEach((producto) => {
                crearVenta(producto);
            });
    
            // Limpiar el carrito después de la compra
            localStorage.setItem('carrito', JSON.stringify([]));
    
            // Mostrar un SweetAlert de éxito
            await Swal.fire({
                title: 'Compra realizada con éxito',
                text: '¡Gracias por tu compra!',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
            });
    
            // Redirigir a la página de tienda
            navigate('/tienda');
        }
    };
    

    const decrementarCantidad = async (codigo) => {
        const precioProducto = productos.map((product) =>
            codigo == product.codigo ? product.precio : 0
        ).filter((precio) => precio !== 0);
    
        const nuevoCarrito = await Promise.all(carrito.map(async (producto) => {
            const codigoProducto =  producto.codigo_producto
            const cantidadVendida = producto.cantidad_vendida;
            
            console.log(codigoProducto, codigo)
            console.log(codigoProducto === codigo)
            console.log(cantidadVendida)

            if (codigoProducto === codigo) {
                if (cantidadVendida > 1) {                    
                        return {
                            ...producto,
                            cantidad_vendida: cantidadVendida - 1,
                            total_venta: (cantidadVendida - 1) * precioProducto,
                        };
                    
                } else {
                    const result = await Swal.fire({
                        title: '¿Desear eliminar el producto del carrito?',
                        text: 'Esta acción eliminará el producto del carrito',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, estoy seguro',
                        allowOutsideClick: false,
                    });
        
                    if (result.isConfirmed) {
                        if (producto.codigo_producto != codigo) {
                            return producto;
                        } else {
                            return null; // Eliminar el producto del carrito
                        }
                    } else {
                        throw new Error('Operación cancelada por el usuario'); // Lanzar un error si la operación es cancelada
                    }
                }
            }
            else{
                return{
                    ...producto
                }
            }
        }));
    
        const carritoFiltrado = nuevoCarrito.filter((producto) => producto !== null);
    
        setCarrito(carritoFiltrado);
        localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
    };
    

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
                .filter((product) => product.codigo === codigo)
                .map((product) => product.stock)[0];

            console.log(stockProducto)
            
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