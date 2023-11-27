import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { useProductos } from '../context/ProductProvider.jsx'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { rol } from '../services/auth.js';
import { useUsuarios } from '../context/UsuarioProvider.jsx';

const FormProducto = () => {
    const navigate = useNavigate()
    const [producto, setProducto] = useState({
        nombre:"",
        descripcion:"",
        precio:1.00,
        stock:1
    })
    const [errors, setErrors] = useState();
    const { token } = useUsuarios()
    const { crearProducto, obtenerProducto, actualizarProducto } = useProductos()
    const {id} = useParams()

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Campo requerido'),
        descripcion: Yup.string().required('Campo requerido'),
        precio: Yup.number()
        .required('El precio es obligatorio')
        .min(0.01, 'El precio debe ser mayor a 0.01'),
        stock: Yup.number()
        .required('El precio es obligatorio')
        .min(1, 'El precio debe ser mayor o igual a 1')
    });

    React.useEffect(()=>{
        const rolUser = rol(token)
        const cargarProducto=async()=>{
            if(id){
                if(rolUser == 'admin' || rolUser == 'asesor'){
                    const user = await obtenerProducto(id)
                    setProducto(user)
                }
            }
        }
        cargarProducto()
    },[])

    return (
        <div className='py-5' style={{ background: 'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))' }}>
            <Formik
                initialValues={producto}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async(values,actions)=>{
                    if(id){
                        if(await actualizarProducto(id,values))
                            navigate("/products")
                    }
                    else{
                        var err = await crearProducto(values)
                        setErrors(err)
                        if(!err)
                            navigate("/products")
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
                                        id ? 'Edicion de Producto' : 'Registrar Producto'
                                    }
                                </h2>
                                <div className="form-outline mb-4">
                                    <label className='form-label'>Nombre</label>
                                    <Field 
                                        type="text" 
                                        placeholder='Ingrese el nombre' 
                                        className='form-control' 
                                        name={id ? '':'nombre'}
                                        onChange={handleChange}
                                        value={values.nombre}
                                    />
                                    <ErrorMessage name='nombre' component='p' className='error' />
                                    {errors && <p>{errors}</p>}
                                </div>

                                <div className="form-outline mb-4">
                                    <label className='form-label'>Descripcion</label>
                                    <Field 
                                        as="textarea" 
                                        placeholder="Ingrese la descripcion" 
                                        className="form-control" 
                                        name="descripcion"
                                        onChange={handleChange}
                                        value={values.descripcion}
                                    />
                                    <ErrorMessage name='descripcion' component='p' className='error' />
                                </div>
                                    
                                <div className="form-outline mb-4">
                                    <label className='form-label'>Precio</label>
                                    <Field 
                                        type="txt" 
                                        placeholder='Ingrese el precio' 
                                        className='form-control'
                                        name='precio'
                                        onChange={handleChange}
                                        value={values.precio}
                                    />
                                    <ErrorMessage name='precio' component='p' className='error' />
                                </div>

                                <div className="form-outline mb-4">
                                    <label className='form-label'>Stock</label>
                                    <Field
                                        type="txt"
                                        className='form-control'
                                        placeholder='Ingrese el stock' 
                                        name='stock' 
                                        onChange={handleChange}
                                        value={values.stock}
                                    />
                                    <ErrorMessage name='stock' component='p' className='error' />
                                    {errors && <p>{errors}</p>}
                                </div>                                            

                                <div className='d-grid gap-2'>
                                    <button className='btn btn-primary btn-block mb-4' type='submit'disabled={isSubmitting}>
                                        {id ? 'Editar' : 'Registrar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>)}
            </Formik>
        </div>
    )
}

export default FormProducto