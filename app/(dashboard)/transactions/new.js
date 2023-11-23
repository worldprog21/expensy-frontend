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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getObject, saveObject } from "@/lib/utils"
import { TableSkeleton } from "@/components/TableSkeleton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader, XIcon, FileCheck2Icon } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import ReactDatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
    amount: z.string({
        required_error: "Please enter the amount.",
    }),
    currency: z.string({
        required_error: "Please select a currency.",
    }),
    category: z.string({
        required_error: "Please select a category.",
    }),
    payment_method: z.string({
        required_error: "Please select a payment method.",
    })
})

const NewCategory = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const jwt = useAuthStore(state => state.jwt);
    const user = useAuthStore(state => state.user);
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [file, setFile] = useState(null);
    const [fileUploading, setFileUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    var form = useForm({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await getObject("transactions", id, true, jwt);

                    if (response.data) {
                        const data = response.data.attributes;
                        form.setValue("amount", data.amount.toString());
                        form.setValue("description", data.description || "");
                        form.setValue("currency", data.currency.data[0].id.toString());
                        form.setValue("category", data.category.data.id.toString());
                        form.setValue("payment_method", data.payment_method.data[0].id.toString());
                        setTransactionDate(new Date(data.date))

                        if (data.receipt.data) {
                            setUploadedFile({
                                id: data.receipt.data[0].id,
                                url: data.receipt.data[0].attributes.url,
                                name: data.receipt.data[0].attributes.name
                            })
                        }
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

        const fetchCurrencies = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/currencies?filters[user][id][$eq]=${user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                });
                setCurrencies(response.data.data);
            } catch (error) {
                return toast({ description: "Something went wrong!", })
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/categories?filters[user][id][$eq]=${user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                });
                setCategories(response.data.data);
            } catch (error) {
                return toast({ description: "Something went wrong!", })
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/payment-methods?filters[user][id][$eq]=${user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                });
                setPaymentMethods(response.data.data);
            } catch (error) {
                return toast({ description: "Something went wrong!", })
            }
        };

        fetchCurrencies()
        fetchCategories()
        fetchPaymentMethods()
    }, [])

    const { mutate } = useMutation({
        mutationFn: (data) => {
            setSubmitting(true);

            const payload = {}
            if (id) { payload.id = id }
            payload.amount = data.amount
            payload.date = transactionDate
            payload.description = form.getValues().description
            payload.currency = data.currency
            payload.category = data.category
            payload.payment_method = data.payment_method
            payload.user = user.id
            if (uploadedFile != null) {
                payload.receipt = uploadedFile
            } else {
                payload.receipt = null
            }

            return saveObject("transactions", payload, jwt);
        },
        onSuccess: (res) => {
            setSubmitting(false);
            queryClient.invalidateQueries("transactions");
            return toast({ description: "Operation was successful!", })
        },
        onError: (error) => {
            setSubmitting(false);
            return toast({ description: "Something went wrong!", })
        },
    });

    function onSubmit(data) {
        mutate(data)
    }

    const uploadFile = async (selectedFile) => {
        setFileUploading(true);
        const formData = new FormData();
        formData.append('files', selectedFile);
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            setUploadedFile(response.data[0]);
            setFileUploading(false);
        } catch (err) {
            console.error(err);
            setFileUploading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        uploadFile(e.target.files[0]);
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <Fragment>
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Amount" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-3">
                            <FormLabel>Date</FormLabel>
                            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground">
                                <ReactDatePicker
                                    className="focus:outline-none"
                                    selected={transactionDate}
                                    onChange={(date) => setTransactionDate(date)}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd hh:mm a"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 space-y-4 md:space-y-0 md:grid-cols-2 items-center gap-2">
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a currency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {currencies?.map((currency) => (
                                                    <SelectItem key={currency.id} value={currency.id.toString()}>{currency.attributes.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>{category.attributes.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="payment_method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a payment method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {paymentMethods?.map((paymentMethod) => (
                                                <SelectItem key={paymentMethod.id} value={paymentMethod.id.toString()}>{paymentMethod.attributes.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write notes about your payment"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-3">
                            <FormLabel>Receipt</FormLabel>
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full py-2 px-3 rounded-md shadow-sm border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out"
                                />
                                {fileUploading ? <Loader className="mr-2 mt-4 h-4 w-4 animate-spin" /> : uploadedFile && (
                                    <div className="mt-3 flex items-center">
                                        <XIcon onClick={() => setUploadedFile(null)} className="ml-2 h-4 w-4 cursor-pointer hover:text-red-500 transition duration-150 ease-in-out" />
                                        <a href={`${process.env.NEXT_PUBLIC_BASE_URL.replace("/api", "")}${uploadedFile.url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                                            {uploadedFile.name}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

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

export default NewCategory