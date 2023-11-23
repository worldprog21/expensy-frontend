"use client"

import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { getObject, saveObject } from "@/lib/utils"
import { TableSkeleton } from "@/components/TableSkeleton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useAuthStore } from "@/stores/auth"

const FormSchema = z.object({
    name: z.string({
        required_error: "Please enter the name.",
    }),
})

const NewPaymentMethod = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const jwt = useAuthStore(state => state.jwt);
    const user = useAuthStore(state => state.user);

    var form = useForm({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await getObject("payment-methods", id, false, jwt);

                    if (response.data) {
                        const data = response.data.attributes;

                        form.setValue("name", data.name);
                    }

                    setLoading(false);
                } catch (error) {
                    console.log({ error });
                    setLoading(false);
                    return toast({
                        variant: "destructive",
                        title: "Error",
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(error, null, 2)}</code>
                            </pre>
                        ),
                    })
                }
            };

            fetchData()
        }
    }, [])

    const { mutate } = useMutation({
        mutationFn: (data) => {
            setSubmitting(true);

            const payload = {}
            if (id) { payload.id = id }
            payload.name = data.name
            payload.symbol = data.symbol
            payload.user = user.id

            return saveObject("payment-methods", payload, jwt);
        },
        onSuccess: (res) => {
            setSubmitting(false);
            queryClient.invalidateQueries("payment-methods");
            return toast({ description: "Operation was successful!", })
        },
        onError: (error) => {
            setSubmitting(false);
            console.log(error)
            return toast({ description: "Something went wrong!", })
        },
    });

    function onSubmit(data) {
        mutate(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <Fragment>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Payment method" {...field} />
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

export default NewPaymentMethod