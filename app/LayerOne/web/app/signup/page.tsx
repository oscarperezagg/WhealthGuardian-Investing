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
import { useRouter } from "next/navigation"




export default function CardWithForm() {
    const { toast } = useToast()
    const router = useRouter()


    // Función para manejar el envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const email = formData.get("mail")
        const password = formData.get("password")
        const fullname = formData.get("fullname")
        console.log(email, password, fullname)
        try {
            const res = await axios.post('/api/auth/signup', {
                email: email,
                password: password,
                fullname: fullname
            })
            console.log(res)
            if (res && res.status === 200) {
                toast({
                    title: "Account created",
                    description: "Your account has been created successfully",
                });
            }
        } catch (error) {
            console.log("error")
            console.log(error)
            if (error instanceof AxiosError) {
                console.log("Yep")
                toast({
                    variant: "destructive",
                    title: error.code,
                    description: error.response?.data.message,
                    action: (
                        <ToastAction altText="Goto schedule to undo">X</ToastAction>
                    ),
                });
            }

        }





    };


    const onHandleClick = () => {
        router.push("/login")
    }

    return (
        <div className="formulario">
            <Toaster />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Create you account in less than one minute.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>

                    <CardContent className="grid gap-4">

                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="fullname">Full name</Label>
                                <Input type="text" id="fullname" name="fullname" placeholder="Jackson Lee" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="mail">Mail</Label>
                                <Input type="mail" id="mail" name="mail" placeholder="m@example.com" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password" />
                            </div>

                        </div>


                        <Button type="submit" className="">Create account</Button>
                    </CardContent>

                </form>

                <CardFooter className="grid gap-4" >

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button onClick={onHandleClick} id="signup" className="w-full" variant="secondary">Sign in</Button>

                </CardFooter >

            </Card>
        </div>

    )
}
