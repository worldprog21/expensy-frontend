"use client"

import PageLoader from '@/components/PageLoader'
import MobileSidebar from '@/components/mobile-sidebar'
import Sidebar from '@/components/sidebar'
import { useAuth } from "@/hooks/useAuth"

const DashbordLayout = ({ children }) => {
    const { loading } = useAuth();
    if (loading) {
        return (
            <PageLoader />
        )
    }

    return (
        <div className='h-full relative'>
            <div className='h-full hidden md:flex md:flex-col md:fixed md:w-72 bg-gray-900'>
                <Sidebar />
            </div>
            <div className='md:pl-72 h-full'>
                <MobileSidebar />
                {children}
            </div>
        </div>
    )
}

export default DashbordLayout