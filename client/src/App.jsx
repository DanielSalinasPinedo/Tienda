import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Usuarios from './pages/Usuarios'
import FormUsuario from './pages/FormUsuario.jsx'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import { UsuarioContextProvider, useUsuarios } from './context/UsuarioProvider'
import Login from './pages/Login'
import { rol } from './services/auth.js'
import * as jwt from 'jwt-decode';
import Productos from './pages/Productos.jsx'
import { ProductContextProvider } from './context/ProductProvider.jsx'
import FormProducto from './pages/FormProducto.jsx'
import Tienda from './pages/Tienda.jsx'
import Carrito from './pages/Carrito.jsx'
import { VentaContextProvider } from './context/VentaProvider.jsx'


function App() {
  return (
    <UsuarioContextProvider>
      <ProductContextProvider>
        <VentaContextProvider>
          <AppContent />
        </VentaContextProvider>
      </ProductContextProvider>
    </UsuarioContextProvider>
  );
}

function AppContent() {
  const { token, tokenUsuario, auth } = useUsuarios();
  useEffect(()=>{
    tokenUsuario()
  },[])

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<FormUsuario />} />
          {(() => {
            if (auth){
              if(rol(token) === 'admin') {
                if(window.location.pathname == '/'){
                  window.location.href = '/usuarios';
                }
                return (
                  <>
                    <Route path='/usuarios' element={<Usuarios />} />
                    <Route path='/products' element={<Productos />} />
                    <Route path='usuarios/editar/:id' element={<FormUsuario />} />
                    <Route path='products/editar/:id' element={<FormProducto />} />
                    <Route path='products/create' element={<FormProducto />} />
                  </>
                );
              }
              else if(rol(token) === 'asesor'){
                if(window.location.pathname == '/'){
                  window.location.href = '/products';
                }
                return (
                  <>
                    <Route path='/products' element={<Productos />} />
                    <Route path='products/create' element={<FormProducto />} />
                    <Route path='products/editar/:id' element={<FormProducto />} />
                  </>
                );
              }
              else if(rol(token) === 'cliente'){
                if(window.location.pathname == '/'){
                  window.location.href = '/tienda';
                }
                return (
                  <>
                    <Route path='/tienda' element={<Tienda />} />
                    <Route path='/carrito' element={<Carrito />} />
                  </>
                );
              }
              else{
                return <Route path='/' element={<Login />} />;
              }
            } else {
              return <Route path='/' element={<Login />} />;
            }
          })()}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App