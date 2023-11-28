import axios from 'axios';
import Cookies from 'js-cookie';
import * as jwt from 'jwt-decode';

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3005"

export const LoginRequest = async (values) => {
    try {
        const response = await axios.post(`${URL}api/login`, values);
        return response;
    } catch (error) {
        throw error;
    }
  };
  

export const TokenRequest = async (tokenCookie) => await axios.post(`${URL}api/auth`, {tokenCookie});

export const logout = () => {
    Cookies.remove('token');
    localStorage.setItem('carrito',[])
};

export const rol = (token) => {
    if(token)
        return jwt.jwtDecode(token).user.rol
    return null
}
