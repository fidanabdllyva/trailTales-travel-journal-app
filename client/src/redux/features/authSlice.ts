import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
    id: string | null;
    email: string | null;
    fullName: string | null;
    username: string | null;
    profileImage?: string | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    id: null,
    email: null,
    fullName: null,
    username: null,
    profileImage: null,
    token: null,
    isAuthenticated: false,
};

function loadInitialUserData(initialUser: UserState) {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            const decoded: {
                authProvider: 'google' | 'local';
                username: string;
                email: string;
                fullName: string;
                profileImage: string;
                id: string;
                iat: number;
                exp: number;
            } = jwtDecode(token);
            initialUser.id = decoded.id;
            initialUser.email = decoded.email;
            initialUser.profileImage = decoded.profileImage;
            initialUser.username = decoded.username;
            initialUser.fullName = decoded.fullName;
            initialUser.isAuthenticated = true;
            initialUser.token = token;
        }
    } catch (error) {
        console.log("error: ", error);
    }
}

loadInitialUserData(initialState);

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<{
                id: string;
                profileImage?: string;
                email: string;
                fullName: string;
                username:string
                token: string;
                rememberMe: boolean;
            }>
        ) => {
            const {
                id,
                email,
                fullName,
                profileImage,
                username,
                token,
                rememberMe,
            } = action.payload;

            state.id = id;
            state.email = email;
            state.fullName = fullName;
            state.profileImage = profileImage || null;
            state.username = username;
            state.token = token;
            state.isAuthenticated = true;

            // Store token in localStorage or sessionStorage based on rememberMe
            if (rememberMe) {
                localStorage.setItem("token", token);
                sessionStorage.removeItem("token");
            } else {
                sessionStorage.setItem("token", token);
                localStorage.removeItem("token");
            }
        },
        logoutUser: (state) => {
            state.id = null;
            state.email = null;
            state.fullName = null;
            state.profileImage = null;
            state.username = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
        },
    },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
