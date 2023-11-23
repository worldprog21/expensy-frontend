"use client"

import { Fragment, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { TableSkeleton } from "@/components/TableSkeleton"
import { Loader } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "next/navigation"
import axios from "axios"

const FormSchema = z.object({
    currentPassword: z.string({
        required_error: "Please enter the current password",
    }),
    password: z.string()
        .min(5, "Password must be at least 5 characters long"),
    passwordConfirmation: z.string()
        .min(5, "Password must be at least 5 characters long")
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
})

const ChangePasswordForm = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const jwt = useAuthStore(state => state.jwt);
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();

    var form = useForm({
        resolver: zodResolver(FormSchema),
    });

    const handleLogout = () => {
        logout();
        router.push("/signin")
    };

    async function onSubmit(data) {
        setSubmitting(true)
        const body = {
            currentPassword: data.currentPassword,
            password: data.password,
            passwordConfirmation: data.passwordConfirmation
        };

        try {
            await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "/auth/change-password", body, {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            });

            toast({ description: "Operation was successfull, signing out..." })
            return handleLogout();
        } catch (error) {
            setSubmitting(false)
            if (error.response) {
                return toast({ description: error.response.data.error.message })
            } else {
                return toast({ description: "Something went wrong!" })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <Fragment>
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Current password" type="password" disabled={loading} {...field} />
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
                                        <Input placeholder="Password" type="password" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Confirm password" type="password" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            {submitting && (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Submit
                        </Button>
                    </Fragment>
                )}
            </form>
        </Form>
    )
}

export default ChangePasswordForm