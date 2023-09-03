"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FormEvent, useState } from "react"
import { set } from "mongoose"
import Link from "next/link"
import { signIn } from "next-auth/react"

import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { toast } = useToast()
    const router = useRouter()

    // Función para manejar el envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        const formData = new FormData(e.currentTarget)

        const email = formData.get("mail")
        const password = formData.get("password")

        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: res.error,
                action: (
                    <ToastAction altText="Goto schedule to undo">X</ToastAction>
                ),
            });
            return
        }

        if (res?.ok) return router.push("eu2/dashboard")

    };

    return (
        <div className="formulario">
            <Toaster />
            <form onSubmit={handleSubmit}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>Sign in with your account.</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="mail">Mail</Label>
                                <Input type="mail" id="mail" name="mail" placeholder="m@example.com"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                />
                            </div>

                        </div>



                    </CardContent>
                    <CardFooter className="justify-between space-x-2">



                        <Link href="/signup" legacyBehavior passHref>
                            <Button id="signup" variant="ghost">Sign up</Button>
                        </Link>

                        <Button type="submit" className="">Sign in</Button>
                    </CardFooter>

                </Card>
            </form>
        </div>

    )
}
