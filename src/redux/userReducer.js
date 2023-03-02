import { createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
        jwt: null
    },
    reducers:{
        loginStart: (state) =>{
            state.isFetching = true;
        },
        loginSuccess: (state, action) =>{
            state.isFetching = false;
            state.currentUser = action.payload.user;
            state.jwt = action.payload.jwt;
        },
        keepLogged: (state, action) =>{
            state.isFetching = false;
            state.currentUser = action.payload.user;
            state.jwt = action.payload.jwt;
            localStorage.setItem("USER_STORAGE", JSON.stringify(action.payload));
        },
        loginFailure: (state) =>{
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) =>{
            state.isFetching = false;
            state.currentUser = null;
            state.jwt = null;
            localStorage.removeItem("USER_STORAGE");
        }
    }
})

export const {loginStart, loginSuccess, loginFailure, logout, keepLogged} = userSlice.actions;
export default userSlice.reducer;