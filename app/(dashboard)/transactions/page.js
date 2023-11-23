"use client"
import { useState } from "react";
import NewTransaction from "./new"
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorComponent from "@/components/ErrorComponent";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader, Plus, X } from "lucide-react"
import { TableSkeleton } from "@/components/TableSkeleton";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { format } from 'date-fns';

const Transactions = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0,
    });
    const [filterField, setFilterField] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [deleting, setDeleting] = useState(false);
    const queryClient = useQueryClient();
    const jwt = useAuthStore(state => state.jwt);
    const user = useAuthStore(state => state.user);

    const fetchData = async (page, filterField, filterValue) => {
        var url = "", filterQuery = "";

        if (filterValue != "" && filterField != "") {
            filterQuery = `&filters[${filterField}][$containsi]=${filterValue}`
        }
        const userQuery = `&filters[user][id][$eq]=${user.id}`

        url = process.env.NEXT_PUBLIC_BASE_URL + `/transactions?populate=*&pagination[page]=${page}&pagination[pageSize]=10&sort[0]=id%3Adesc` + filterQuery + userQuery

        const { data } = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        });

        setPagination(data?.meta?.pagination);

        return data?.data;
    };

    const { isLoading, error, data, isFetching } =
        useQuery({
            queryKey: ["transactions", pagination.page, filterField, filterValue, user],
            queryFn: () => fetchData(pagination.page, filterField, filterValue),
            keepPreviousData: true,
            staleTime: Infinity,
        });

    const { toast } = useToast()
    const handleConfirmation = (id) => {
        toast({
            variant: "destructive",
            title: "Deleting record",
            description: "Are you sure you want to delete this record?",
            action: <ToastAction altText="Yes" onClick={() => mutate(id)}>
                {deleting && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Yes
            </ToastAction>,
        })
    };

    const { mutate } = useMutation({
        mutationFn: (id) => {
            setDeleting(true);
            return axios.delete(
                process.env.NEXT_PUBLIC_BASE_URL + `/transactions/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            }
            );
        },
        onSuccess: (res) => {
            setDeleting(false);
            queryClient.invalidateQueries("transactions");
            return toast({ description: "Operation was successful." })
        },
        onError: (error) => {
            setDeleting(false);
            return toast({ description: "Something went wrong!" })
        },
    });

    const handlePageChange = (page) => {
        setPagination((prevState) => ({ ...prevState, page }));
    };

    const handleFirstPage = () => {
        handlePageChange(1);
    };

    const handleLastPage = () => {
        handlePageChange(pagination.pageCount);
    };

    const handleFilterFieldChange = (event) => {
        setPagination((prevState) => ({ ...prevState, page: 1 }));
        setFilterField(event.target.value);
        setFilterValue("");
    };

    const handleFilterValueChange = (event) => {
        setPagination((prevState) => ({ ...prevState, page: 1 }));
        setFilterValue(event.target.value);
    };

    const handleRemoveFilter = () => {
        setFilterValue("");
    };

    return (
        <div className="h-full -mt-6 p-10 md:p-5">
            <div className="rounded bg-gray-50 h-full border border-dashed p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-medium">Transactions</h1>

                    <Modal
                        trigger={
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        }
                        header={"Add a new transaction"}
                    >
                        <div className="overflow-y-auto h-[calc(100vh-150px)] p-5">
                            <NewTransaction />
                        </div>
                    </Modal>
                </div>

                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5 mb-5">
                    <div className="relative rounded-md shadow-sm w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <select
                                id="filterField"
                                name="filterField"
                                value={filterField}
                                onChange={handleFilterFieldChange}
                                className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-offset-background sm:text-sm"
                            >
                                <option value="">Select Field</option>
                                <option value="amount">Amount</option>
                                <option value="date">date</option>
                            </select>
                        </div>
                        <div className="flex gap-0 items-center">
                            <input
                                type="text"
                                id="filterValue"
                                name="filterValue"
                                value={filterValue}
                                onChange={handleFilterValueChange}
                                disabled={filterField ? false : true}
                                className="block w-full rounded-md border-0 py-1.5 pl-40 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-offset-background sm:text-sm sm:leading-6"
                                placeholder="Search..."
                            />
                            {filterValue == "" ? (
                                ""
                            ) : (
                                <X
                                    className="w-3 h-3 text-gray-500 -ml-5 cursor-pointer hover:text-black transition-all"
                                    onClick={handleRemoveFilter}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                {isLoading || isFetching ? (
                    <TableSkeleton />
                ) : error ? (
                    <ErrorComponent />
                ) : (
                    <div className="w-full">
                        <div className="bg-white p-5 rounded shadow-md overflow-x-auto">
                            <table className="divide-y divide-gray-300 min-w-full" >
                                {/* Table Headers */}
                                <thead className="bg-white">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Category
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Currency
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Payment Method
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Note
                                        </th>
                                        <th
                                            scope="col"
                                        >
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data?.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-all">
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {item.attributes.amount}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {format(new Date(item.attributes.date), 'yyyy-MM-dd hh:mm a')}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {item.attributes.category?.data?.attributes.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {item.attributes.currency?.data[0]?.attributes.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {item.attributes.payment_method?.data[0]?.attributes.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                {item.attributes.description}
                                            </td>
                                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex items-center gap-2">
                                                <Modal
                                                    trigger={
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit<span className="sr-only">edit</span>
                                                        </button>
                                                    }
                                                    header={"Edit transaction"}
                                                >
                                                    <div className="overflow-y-auto h-[calc(100vh-150px)] p-5">
                                                        <NewTransaction id={item.id} />
                                                    </div>
                                                </Modal>

                                                <button
                                                    onClick={(e) => handleConfirmation(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete<span className="sr-only">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex items-center min-w-full justify-between border-t border-gray-200 bg-white py-3">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a
                                    href="#"
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                                <a
                                    href="#"
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {pagination.page}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {pagination.pageCount}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {pagination.total}
                                        </span>{" "}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            onClick={handleFirstPage}
                                            disabled={pagination.page === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">First page</span>
                                            <ChevronsLeft
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePageChange(pagination.page - 1)
                                            }
                                            disabled={pagination.page === 1}
                                            aria-current="page"
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePageChange(pagination.page + 1)
                                            }
                                            disabled={
                                                pagination.page === pagination.pageCount
                                            }
                                            aria-current="page"
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <button
                                            onClick={handleLastPage}
                                            disabled={
                                                pagination.page === pagination.pageCount
                                            }
                                            href="#"
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">Last page</span>
                                            <ChevronsRight
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Transactions