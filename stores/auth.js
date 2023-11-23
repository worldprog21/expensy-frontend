import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(persist(
    (set) => ({
        jwt: null,
        user: null,
        setAuth: (jwt, user) => set(() => ({ jwt, user })),
        logout: () => set(() => ({ jwt: null, user: null })),
    }),
    {
        name: 'authStore',
        getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
    }
));