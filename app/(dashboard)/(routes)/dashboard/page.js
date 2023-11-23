"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { toast } from "@/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Dashboard() {
    const [data, setData] = useState(null);
    const jwt = useAuthStore(state => state.jwt);
    const user = useAuthStore(state => state.user);
    const userQuery = `&filters[user][id][$eq]=${user?.id}`
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState();
    const [selectedType, setSelectedType] = useState();
    const [trans, setTrans] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(process.env.NEXT_PUBLIC_BASE_URL + '/transactions?populate=*' + userQuery, {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            });
            setData(result.data);
            setTrans(result.data);
        };

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

        fetchCurrencies();
        fetchData();
    }, []);

    if (!data) {
        return <PageLoader />
    }

    const handleSearchByMonth = async (e) => {
        e.preventDefault();

        if (selectedCurrency && selectedType) {
            try {
                setSubmitting(true)
                const result = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `/transactions?filters[currency][id][$eq]=${selectedCurrency}&filters[category][type][$eq]=${selectedType}` + userQuery, {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                });
                setTrans(result.data);
                setSubmitting(false)
            } catch (error) {
                console.error(error)
                setSubmitting(false)
                return toast({
                    variant: "destructive",
                    title: "Error",
                    description: (
                        <p>
                            Something went wrong
                        </p>
                    ),
                })
            }
        } else {
            return toast({
                variant: "destructive",
                title: "Error",
                description: (
                    <p>
                        Please select currency and type first
                    </p>
                ),
            })
        }
    }

    // Group transactions by category
    const transactionsByCategory = data.data.reduce((acc, transaction) => {
        if (transaction.attributes.category.data) {
            const categoryName = transaction.attributes.category.data.attributes.name;
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(transaction);
        }
        return acc;
    }, {});

    // Generate random colors with 50% opacity for Categories
    const backgroundColorsCategories = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    const hoverBackgroundColorsCategories = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);

    const categoriesChartData = {
        labels: Object.keys(transactionsByCategory),
        datasets: [{
            label: '# of Transactions',
            data: Object.values(transactionsByCategory).map(transactions => transactions.length),
            backgroundColor: backgroundColorsCategories,
            hoverBackgroundColor: hoverBackgroundColorsCategories
        }]
    };

    const categoriesOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Transactions by Categories',
            }
        },
    };

    const transactionsByCurrency = data.data.reduce((acc, transaction) => {
        if (transaction.attributes.currency.data) {
            const currencyName = transaction.attributes.currency.data[0].attributes.name;
            if (!acc[currencyName]) {
                acc[currencyName] = [];
            }
            acc[currencyName].push(transaction);
            return acc;
        }
    }, {});

    const backgroundColorsCurrencies = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    const hoverBackgroundColorsCurrencies = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);

    const currenciesChartData = {
        labels: Object.keys(transactionsByCurrency),
        datasets: [{
            label: '# of Transactions',
            data: Object.values(transactionsByCurrency).map(transactions => transactions.length),
            backgroundColor: backgroundColorsCurrencies,
            hoverBackgroundColor: hoverBackgroundColorsCurrencies
        }]
    };

    const currenciesOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Transactions by Currencies',
            }
        },
    };

    // Group transactions by payment methods
    const transactionsByPaymentMethod = data.data.reduce((acc, transaction) => {
        if (transaction.attributes.payment_method.data) {
            const paymentMethod = transaction.attributes.payment_method.data[0].attributes.name;
            if (!acc[paymentMethod]) {
                acc[paymentMethod] = [];
            }
            acc[paymentMethod].push(transaction);
            return acc;
        }
    }, {});

    const backgroundColorsPaymentMethods = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    const hoverBackgroundColorsPaymentMethods = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);

    const paymentMethodsChartData = {
        labels: Object.keys(transactionsByPaymentMethod),
        datasets: [{
            label: '# of Transactions',
            data: Object.values(transactionsByPaymentMethod).map(transactions => transactions.length),
            backgroundColor: backgroundColorsPaymentMethods,
            hoverBackgroundColor: hoverBackgroundColorsPaymentMethods
        }]
    };

    const paymentMethodsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Transactions by Payment Methods',
            }
        },
    };

    const currentYear = new Date().getFullYear();
    // Group transactions by month and calculate the sum of amount
    const transactionsByMonth = trans.data.reduce((acc, transaction) => {
        const date = new Date(transaction.attributes.date);
        // Only include transactions from the current year
        if (date.getFullYear() === currentYear) {
            const month = date.toLocaleString('default', { month: 'long' });
            if (!acc[month]) {
                acc[month] = 0; // Initialize the sum for this month
            }
            acc[month] += transaction.attributes.amount; // Add the amount of the current transaction to the sum
        }
        return acc;
    }, {});

    const backgroundColorsByMonths = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    const hoverBackgroundColorsByMonths = data.data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);

    const monthsChartData = {
        labels: Object.keys(transactionsByMonth),
        datasets: [{
            label: 'Amount',
            data: Object.values(transactionsByMonth),
            backgroundColor: backgroundColorsByMonths,
            hoverBackgroundColor: hoverBackgroundColorsByMonths
        }]
    };

    return (
        <div className="-mt-6 p-10 md:p-5">
            <div className="rounded bg-gray-50 border border-dashed p-10">
                <div className="grid md:grid-cols-3 gap-4 justify-center">
                    <div className="">
                        <Pie options={categoriesOptions} data={categoriesChartData} />
                    </div>
                    <div className="">
                        <Pie options={currenciesOptions} data={currenciesChartData} />
                    </div>
                    <div className="">
                        <Pie options={paymentMethodsOptions} data={paymentMethodsChartData} />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-4 mt-10'>
                    <p className='font-semibold'>Amounts by Month</p>
                    <div className='flex flex-col md:flex-row md:items-center gap-4'>
                        <div className='flex flex-col md:flex-row md:items-center gap-2 w-full'>
                            <p>Currency</p>
                            <Select onValueChange={(e) => setSelectedCurrency(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies?.map((currency) => (
                                        <SelectItem value={currency.id.toString()}>{currency.attributes.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex flex-col md:flex-row md:items-center gap-2 w-full'>
                            <p>Type</p>
                            <Select onValueChange={(e) => setSelectedType(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Expense">Expense</SelectItem>
                                    <SelectItem value="Income">Income</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={(e) => handleSearchByMonth(e)}>
                            {submitting && (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Submit
                        </Button>
                    </div>
                    <div className='h-96 w-full'>
                        <Bar options={{ responsive: true, maintainAspectRatio: false, }} data={monthsChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
