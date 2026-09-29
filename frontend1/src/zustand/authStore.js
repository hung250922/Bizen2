import { create } from "zustand";
import httpClient from "../services/http-client";
import { API_SUB_URL_AUTHENTICATE } from "../constants"

export const authStore = create((set) => ({
    userLoginData: {},
    //authenticate: () => set((state) => ({ count: state.count + 1 })),
    authenticate: async(payload) => {
        const res = await httpClient.post(API_SUB_URL_AUTHENTICATE, payload);
        return res;
    },
}));