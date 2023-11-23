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

const FormSchema = z.object({
    fullName: z.string({
        required_error: "Please enter your full name.",
    }),
    email: z.string({
        required_error: "Please enter your email.",
    }).email(),
    password: z.string()
        .min(5, "Password must be at least 5 characters long"),
    confirmPassword: z.string()
        .min(5, "Password must be at least 5 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    var form = useForm({
        resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data) {
        setIsLoading(true);

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/auth/local/register", {
                username: data.email,
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            });

            console.log("Registration successful:", response.data);
            toast({ description: "Registration successful", })

            setTimeout(() => {
                router.push("/signin");
            }, 1000);
        } catch (error) {
            setIsLoading(false);

            if (error.response) {
                console.error(error.response.data.error.message);
                return toast({
                    description: error.response.data.error.message,
                    variant: "destructive",
                    title: "Error"
                })
            } else {
                return toast({
                    description: "An error occurred during registration.",
                    variant: "destructive",
                    title: "Error"
                })
            }
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Full name" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
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

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Confirm password" type="password" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign up
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
