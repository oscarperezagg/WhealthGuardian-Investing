

import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { MainNav } from "../navbar/mainNav"
import { Search } from "./search"
import { UserNav } from "./user-nav"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Example dashboard app built using the components.",
}

export function FullNavBar() {
    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        
                        <MainNav className="" />
                        <div className="ml-auto flex items-center space-x-4">
                            <div className="">
                                <Search />
                            </div>
                            <UserNav />
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}