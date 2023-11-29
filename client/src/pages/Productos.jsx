import React, { useEffect, useState } from 'react'
import { useProductos } from '../context/ProductProvider.jsx'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


const Producto = () => {
  const {productos, setProductos, obtenerProductos, deleteProducto} = useProductos()

  const navigate = useNavigate()

  const eliminar = (codigo) =>{
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro'
    }).then(async(result) => {
      if (result.isConfirmed) {
        var err = await deleteProducto(codigo)
        if(!err){
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado exitosamente.',
            'success'
          );
        }
        else{
          Swal.fire(
            '¡No se pudo eliminar!',
            err,
            'error'
          );
        }
      }
    });
  }

  useEffect(()=>{
    obtenerProductos()
  },[])

  return (
    <div className='container'>
      <h1 className='text-center text-primary'>Productos Registrados</h1>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Nombre</th>
            <th scope='col'>Precio</th>
            <th scope='col'>Stock</th>
            <th scope='col'>Acciones</th>
            {/* Agrega más encabezados según las propiedades de tu objeto producto */}
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.codigo}>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>
                <button onClick={()=>navigate(`./editar/${producto.codigo}`)} className='btn btn-outline-primary me-2' type="button">Edit</button>
                <button onClick={()=>eliminar(producto.codigo)} className='btn btn-outline-danger me-2' type="button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Producto