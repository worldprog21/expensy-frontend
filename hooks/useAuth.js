"use client"

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const jwt = useAuthStore(state => state.jwt);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!jwt) {
            router.push('/signin');
        } else {
            setLoading(false);
        }
    }, [jwt, router]);

    return { loading };
}


