"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import axios from "axios"
import { toast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuthStore } from '@/stores/auth';

const FormSchema = z.object({
    identifier: z.string({
        required_error: "Please enter your email.",
    }).email(),
    password: z.string()
        .min(5, "Password must be at least 5 characters long"),
})

export function SigninForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const setAuth = useAuthStore(state => state.setAuth);

    var form = useForm({
        resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data) {
        try {
            setIsLoading(true)
            const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/auth/local', {
                identifier: data.identifier,
                password: data.password,
            });

            if (response.data.jwt) {
                setAuth(response.data.jwt, response.data.user);
                setIsLoading(false)
                router.push('/dashboard');
            }
        } catch (error) {
            setIsLoading(false)
            if (error.response.data.error.name == "ValidationError" && error.response.data.error.status === 400) {
                return toast({ variant: "destructive", description: "Invalid credentials..." })
            }
            return toast({ variant: "destructive", description: "Something went wrong!" })
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign in
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
