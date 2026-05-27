// State layer using the Redux toolkit
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null
    },
    reducers:{
        // Theses are the actions inside the reducer by which we can change the state values user, loading, error 
        setUser:(state, action)=>{
            state.user = action.payload
        },

        setLoading:(state, action)=>{
            state.loading = action.payload
        },

        setError:(state, action)=>{
            state.error = action.payload
        }
    }

})

export const {setUser, setLoading, setError} = authSlice.actions;
export default authSlice.reducer