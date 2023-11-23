import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignupForm } from "@/components/SignupForm"

export default function SignupPage() {
    return (
        <div className="w-full relative h-full flex-col items-center justify-center grid lg:grid-cols-2 lg:px-0">
            <Link
                href="/signin"
                className="absolute right-4 top-4 md:right-8 md:top-8"
            >
                <Button>
                    Log in to your account
                </Button>
            </Link>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] to-[#2D3748]" />
                <Link
                    href="/"
                    className="relative z-20 flex items-center text-lg font-medium">
                    Expensy
                </Link>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Your finances at your fingertips, track your earnings and your slips. <span className="font-bold">Expensy</span> is your guide, on your journey to the prosperous side.&rdquo;
                        </p>
                        <footer className="text-sm">Expensy Team</footer>
                    </blockquote>
                </div>
            </div>
            <div className="p-8 xl:px-52">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome to <Link href="/" className="font-extrabold">Expensy</Link>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}
