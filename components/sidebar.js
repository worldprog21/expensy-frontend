"use client"
import { cn } from '@/lib/utils'
import { LayoutDashboard, LayersIcon, DollarSignIcon, BanknoteIcon, LogOutIcon, Wallet2Icon, LockIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import Modal from './Modal'
import ChangePasswordForm from './ChangePasswordForm'

const Sidebar = () => {
    const pathName = usePathname();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const router = useRouter();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Categories",
            icon: LayersIcon,
            href: "/categories",
            color: "text-sky-500",
        },
        {
            label: "Currencies",
            icon: DollarSignIcon,
            href: "/currencies",
            color: "text-sky-500",
        },
        {
            label: "Payment Methods",
            icon: BanknoteIcon,
            href: "/payment-method",
            color: "text-sky-500",
        },
        {
            label: "Transactions",
            icon: Wallet2Icon,
            href: "/transactions",
            color: "text-sky-500",
        },
    ]

    const handleLogout = () => {
        logout();
        router.push("/signin")
    };

    return (
        <div className='flex flex-col gap-10 h-full bg-[#111827] text-white px-3 py-5 flex-1'>
            <div className='space-y-10 divide-y-2 divide-gray-200 divide-opacity-30'>
                <div className='flex flex-col gap-3 items-center justify-center'>
                    <p className='relative text-xl font-bold'>
                        Expensy
                    </p>
                    <p>
                        Welcome {user && user.fullName}
                    </p>
                </div>

                <div className='space-y-1 pt-5'>
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.label}
                            className={cn('text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all', pathName == route.href ? "text-white bg-white/10" : "text-zinc-400")}
                            onClick={route.onClick}
                        >
                            <div className='flex items-center flex-1'>
                                <route.icon
                                    className={cn("h-5 w-5 mr-3", route.color)}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}

                    <Modal
                        trigger={
                            <div
                                className='text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all text-zinc-400'
                            >
                                <div className='flex items-center flex-1'>
                                    <LockIcon
                                        className="h-5 w-5 mr-3 text-sky-500"
                                    />
                                    Change Password
                                </div>
                            </div>
                        }
                        header={"Change password"}
                        children={
                            <ChangePasswordForm />
                        }
                    />

                    <div
                        className='text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all text-zinc-400'
                        onClick={handleLogout}
                    >
                        <div className='flex items-center flex-1'>
                            <LogOutIcon
                                className="h-5 w-5 mr-3 text-sky-500"
                            />
                            Sign Out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar