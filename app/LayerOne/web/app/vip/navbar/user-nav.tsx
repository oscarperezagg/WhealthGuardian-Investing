'use client';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSession } from 'next-auth/react';



// Función para obtener las iniciales del nombre
function getInitials(name: string): string {
    if (typeof name !== 'string' || name.trim() === '') {
        // Verificar si name no es una cadena o está vacío
        return '';
    }

    const words = name.trim().split(' ');
    if (words.length === 1) {
        // Si solo hay una palabra, devolver las dos primeras letras de esa palabra
        const firstWord = words[0];
        return firstWord.length >= 2 ? firstWord.substr(0, 2).toUpperCase() : firstWord.toUpperCase();
    } else if (words.length >= 2) {
        // Si hay al menos dos palabras, devolver las iniciales de las dos primeras palabras
        const firstInitial = words[0].charAt(0);
        const secondInitial = words[1].charAt(0);
        return `${firstInitial}${secondInitial}`.toUpperCase();
    } else {
        // Si no hay palabras válidas, devolver una cadena vacía
        return '';
    }
}


import { signOut } from "next-auth/react"
export function UserNav() {


    const { data: session } = useSession();
    console.log(session);

    // Función que manejará el evento onClick del botón "Log out"
    const handleLogoutClick = async () => {
        await signOut({ callbackUrl: '/login' }); // Especifica la callbackUrl
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                        <AvatarFallback>{getInitials(session?.user?.fullname)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.fullname}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogoutClick} >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}