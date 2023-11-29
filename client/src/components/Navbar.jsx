import React from 'react'
import { Link } from 'react-router-dom'
import { useUsuarios } from '../context/UsuarioProvider';
import { logout, rol } from '../services/auth';

const Navbar = () => {
  const { token, tokenUsuario, auth } = useUsuarios();

  const handleCerrarSesion = () => {
    // Llama a la función para cerrar sesión y borrar la cookie del token
    logout();
    // Llama a la función tokenUsuario para actualizar el estado del token en el contexto
    tokenUsuario();
    window.location.href = '/';
  };
  return (
    <div className='navbar navbar-dark bg-dark justify-content-evenly'>
        {auth ? (
          // Renderiza estos enlaces si el usuario tiene un token
          <>
            {rol(token) === 'admin' && (
              <>
                <Link className='btn btn-dark' to='/usuarios'>Usuarios</Link>
                <Link className='btn btn-dark' to='/products'>Productos</Link>
                <Link className='btn btn-dark' to='/products/create'>Crear Producto</Link>
              </>
            )}
            {rol(token) === 'asesor' && (
              <>
                <Link className='btn btn-dark' to='/products'>Productos</Link>
                <Link className='btn btn-dark' to='/products/create'>Crear Producto</Link>
              </>
            )}
            {rol(token) === 'cliente' && (
              <>
                <Link className='btn btn-dark' to='/tienda'>Tienda</Link>
                <Link className='btn btn-dark' to='/carrito'>Carrito</Link>
              </>
            )}
            <div>
              <Link className='btn btn-dark' onClick={handleCerrarSesion}>Cerrar Sesion</Link>
            </div>
          </>
          ) : (
            // Renderiza esto si el usuario no tiene un token
            <>
              <Link className='btn btn-dark' to='/'>Inicio</Link>
              <Link className='btn btn-dark' to='/register'>Registrarse</Link>
            </>
        )}
    </div>
  )
}

export default Navbar