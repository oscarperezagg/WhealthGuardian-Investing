'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"

export default function main() {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "authenticated") {
    router.push("/vip/dashboard"); // Navega a /vip/dashboard si está autenticado
    return null;
  } else {
    router.push("/login"); // Navega a /login si no está autenticado
    return null;
  }
}
