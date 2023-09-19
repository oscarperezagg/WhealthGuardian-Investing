import { Metadata } from "next"
import Image from "next/image"
import { FullNavBar } from "./navbar/fullnavbar"


interface SettingsLayoutProps {
    children: React.ReactNode
}
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
        
            <div className="hidden md:block">
                <FullNavBar />
                {children}
            </div>
            <div className="md:hidden p-8">
                    <Alert >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Attention!</AlertTitle>
                        <AlertDescription>
                            This website is not optimized for mobile devices. Please use a desktop browser to access all the features.
                        </AlertDescription>
                    </Alert>
                </div>

        </>
    )
}