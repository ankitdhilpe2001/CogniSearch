import { useDispatch, useSelector } from "react-redux"
import {setUser,setLoading,setError} from "../auth.slice.js"
import { register,login, getMe } from "../services/auth.api.js"

export function useAuth(){

    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    async function handleRegister({ username, email, password }) {
        try {
            //instead of calling set state function 
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ username, email, password });
            return data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({email, password}){
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await login({email, password})
            dispatch(setUser(data.user));
            return data
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetme() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getMe();
            dispatch(setUser(data.user))
        } catch  {
            dispatch(setUser(null));
            dispatch(setError(null));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { user, loading, error, handleRegister, handleLogin, handleGetme };
}