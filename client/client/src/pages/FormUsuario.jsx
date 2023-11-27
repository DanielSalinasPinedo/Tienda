import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { useUsuarios } from '../context/UsuarioProvider.jsx'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { rol } from '../services/auth.js';

const FormUsuario = () => {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState({
        usuario:"",
        password:"",
        rol:"cliente"
    })
    const [errors, setErrors] = useState();
    const {crearUsuario, obtenerUsuario, actualizarUsuario, token } = useUsuarios()
    const {id} = useParams()

    const validationSchema = Yup.object().shape({
        usuario: Yup.string().required('Campo requerido'),
        password: Yup.string().required('Campo requerido'),
        confirmPassword: !id
        ? Yup.string()
            .required('Campo requerido')
            .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        : Yup.string(),
        rol: Yup.string().required('Campo requerido').oneOf(['asesor', 'cliente'], 'Seleccione un rol válido'),
    });

    React.useEffect(()=>{
        const rolUser = rol(token)
        const cargarUsuario=async()=>{
            if(id){
                if(rolUser == 'admin'){
                    const user = await obtenerUsuario(id)
                    setUsuario(user)
                }
            }
        }
        cargarUsuario()
    },[])

    return (
        <div className='py-5' style={{ background: 'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))' }}>
            <Formik
                initialValues={usuario}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async(values,actions)=>{
                    if(id){
                        if(await actualizarUsuario(id,values))
                            navigate("/usuarios")
                    }
                    else{
                        var err = await crearUsuario(values)
                        setErrors(err)
                        if(!err)
                            navigate("/")
                    }
                }}
            >
                {({handleChange, handleSubmit, values, isSubmitting})=>(
                <Form onSubmit={handleSubmit}>
                    <div className="container rounded-pill d-flex justify-content-center bg-dark text-white">
                        <div className="w-50 mt-3"> 
                            <div className="tab-content py-5">
                                <h2 className='text-center'>
                                    {
                                        id ? 'Edicion de Usuario' : 'Registro de Usuario'
                                    }
                                </h2>
                                <div className="form-outline mb-4">
                                    <label className='form-label'>Usuario</label>
                                    <Field 
                                        type="text" 
                                        placeholder='Ingrese el usuario' 
                                        className='form-control' 
                                        name={id ? '':'usuario'}
                                        onChange={handleChange}
                                        value={values.usuario}
                                    />
                                    <ErrorMessage name='usuario' component='p' className='error' />
                                    {errors && <p>{errors}</p>}
                                </div>

                                <div className="form-outline mb-4">
                                    <label className='form-label'>Contraseña</label>
                                    <Field 
                                        type="password" 
                                        placeholder='Ingrese la contraseña' 
                                        className='form-control' 
                                        name='password'
                                        onChange={handleChange}
                                        value={values.password}
                                    />
                                    <ErrorMessage name='password' component='p' className='error' />
                                </div>
                                    
                                {!id && <div className="form-outline mb-4">
                                    <label className='form-label'>Repita la Contraseña</label>
                                    <Field 
                                        type="password" 
                                        placeholder='Repita la contraseña' 
                                        className='form-control'
                                        name='confirmPassword'
                                    />
                                    <ErrorMessage name='confirmPassword' component='p' className='error' />
                                </div>
                                }

                                {id && 
                                    <div className="form-outline mb-4">
                                        <label className='form-label'>Rol</label>
                                        <Field 
                                            as='select' 
                                            className='form-control' 
                                            name='rol' 
                                            onChange={handleChange}
                                            value={values.rol}
                                        >
                                            <option value='asesor'>Asesor</option>
                                            <option value='cliente'>Cliente</option>
                                        </Field>
                                        <ErrorMessage name='usuario' component='p' className='error' />
                                        {errors && <p>{errors}</p>}
                                    </div>
                                }

                                <div className='d-grid gap-2'>
                                    <button className='btn btn-primary btn-block mb-4' type='submit'disabled={isSubmitting}>
                                        {id ? 'Editar' : 'Registrar'}
                                    </button>
                                </div>

                                {!id &&
                                    <div className="text-center">
                                        <p>¿Ya estas registrado? <a href="/">Logeate</a></p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </Form>)}
            </Formik>
        </div>
    )
}

export default FormUsuario