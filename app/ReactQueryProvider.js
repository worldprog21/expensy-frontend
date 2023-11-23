"use client"

import axios from 'axios';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const defaultQueryFn = async ({ queryKey }) => {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${queryKey[0]}`,
    )
    return data
}

const queryClient = new QueryClient()

export const ReactQueryProvider = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}