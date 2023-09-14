import { Metadata } from "next"
import Image from "next/image"
import { FullNavBar } from "./navbar/fullnavbar"


interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <FullNavBar />

            {children}
        </>
    )
}