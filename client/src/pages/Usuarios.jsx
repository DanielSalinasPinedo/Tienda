import React, { useEffect, useState } from 'react'
import { useUsuarios } from '../context/UsuarioProvider.jsx'
import { useNavigate } from 'react-router-dom'
import * as jwt from 'jwt-decode';


const Usuarios = () => {
  const {usuarios, setUsuarios, obtenerUsuarios, deleteUsuario, token, auth} = useUsuarios()

  const navigate = useNavigate()

  useEffect(()=>{
    obtenerUsuarios()
  },[])

  return (
    <div className='container'>
      <h1 className='text-center text-primary'>Usuarios Registrados</h1>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Usuario</th>
            <th scope='col'>Rol</th>
            <th scope='col'>Acciones</th>
            {/* Agrega más encabezados según las propiedades de tu objeto usuario */}
          </tr>
        </thead>
        <tbody>
          {usuarios.filter(usuario=> usuario.usuario !== 'admin').map(usuario => (
            <tr key={usuario.codigo}>
              <td>{usuario.usuario}</td>
              <td>{usuario.rol}</td>
              <td>
                <button onClick={()=>navigate(`./editar/${usuario.codigo}`)} className='btn btn-outline-primary me-2' type="button">Edit</button>
                <button onClick={()=>deleteUsuario(usuario.codigo)} className='btn btn-outline-danger me-2' type="button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Usuarios