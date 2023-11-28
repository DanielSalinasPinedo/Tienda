import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useUsuarios } from '../context/UsuarioProvider'

const Login = () => {
    const { login, token, tokenUsuario, auth } = useUsuarios()
    const [errors,setErrors] = useState()
    const [usuario, setUsuario] = useState({
        usuario:"",
        password:""
    })

  return (
    <div className='py-5' style={{ background: 'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))' }}>
        <div className="pb-5 container rounded-pill d-flex justify-content-center bg-dark text-white col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="w-50 mt-3">
                <div className="tab-content py-5">
                    <h2 className='text-center'>Login</h2>
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        <Formik
                            initialValues={usuario}                        
                            enableReinitialize={true}
                            onSubmit={async(values,actions)=>{
                                var a = await login(values)
                                setErrors(a)
                                if(!a)
                                    window.location.reload()
                            }}
                        >
                            {({handleChange, handleSubmit, values, isSubmitting})=>(
                            <Form onSubmit={handleSubmit}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="usuario">Usuario</label>
                                    <Field
                                        type="text" 
                                        id="usuario" 
                                        name="usuario" 
                                        className="form-control" 
                                        placeholder="Ingrese su nombre de usuario" required
                                        onChange={handleChange}
                                        value={values.usuario}
                                    />
                                </div>
                        
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <Field 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        className="form-control" 
                                        placeholder="Ingrese su contraseña" required
                                        onChange={handleChange}
                                        value={values.password}
                                    />
                                </div>
                                {errors && <p>{errors}</p>}

                                <div className='d-grid gap-2'>
                                    <button type="submit" className="btn btn-primary btn-block mb-4">Ingresar</button>
                                </div>
                                <div className="text-center">
                                    <p>¿Aun no eres un miembro? <a href="/register">Registrese</a></p>
                                </div>
                            </Form>)}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
