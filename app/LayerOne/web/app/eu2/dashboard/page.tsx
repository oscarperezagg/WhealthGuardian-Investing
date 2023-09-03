'use client';

import { signOut } from "next-auth/react"

export default () => {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' }); // Especifica la callbackUrl
    };

    return (
        <button onClick={handleSignOut}>Sign out</button>
    );
}
