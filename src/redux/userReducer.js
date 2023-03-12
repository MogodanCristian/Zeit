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
            state.error = false;
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
        },
        startDataFetching : (state) =>{
            state.isFetching = true;
        },
        errorDataFetching: (state) =>{
            state.isFetching = false;
            state.error = true;
        },
        successDataFetching: (state) =>{
            state.isFetching = false;
            state.error = false;
        }
    }
})

export const {loginStart, loginSuccess, loginFailure, logout, keepLogged, startDataFetching, errorDataFetching, successDataFetching} = userSlice.actions;
export default userSlice.reducer;