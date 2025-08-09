import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
    id: string | null;
    email: string | null;
    fullName: string | null;
    username: string | null;
    profileImage: string | null;
    premium: boolean;
    authProvider: 'google' | 'local' | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    id: null,
    email: null,
    fullName: null,
    username: null,
    profileImage: null,
    premium: false,
    authProvider: null,
    token: null,
    isAuthenticated: false,
};

function loadInitialUserData(initialUser: UserState) {
    try {
        // Check localStorage first, then sessionStorage
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            const decoded: {
                authProvider: 'google' | 'local';
                premium: boolean;
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
            initialUser.authProvider = decoded.authProvider;
            initialUser.premium = decoded.premium;
            initialUser.username = decoded.username;
            initialUser.fullName = decoded.fullName;
            initialUser.profileImage = decoded.profileImage;
            initialUser.isAuthenticated = true;
            initialUser.token = token;
        }
    } catch (error) {
        console.log("error: ", error);
    }
}

loadInitialUserData(initialState);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<{
                id: string;
                email: string;
                fullName: string;
                username:string
                profileImage: string;
                premium: boolean;
                authProvider: 'google' | 'local';
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
                premium,
                authProvider,
                token,
                rememberMe,
            } = action.payload;

            state.id = id;
            state.email = email;
            state.fullName = fullName;
            state.username = username;
            state.profileImage = profileImage;
            state.premium = premium;
            state.authProvider = authProvider;
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
            state.username = null;
            state.profileImage = null;
            state.premium = false;
            state.authProvider = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
