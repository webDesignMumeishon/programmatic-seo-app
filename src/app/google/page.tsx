import GoogleAuth from "@/components/google.auth";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { verifySession } from "@/lib/dal";
import { AlertCircle, LogOut } from "lucide-react"
import { useSession, signIn, signOut } from 'next-auth/react';
import { redirect } from "next/navigation";

export default async function Page() {
    const { hasToken } = await verifySession()

    if (!hasToken) {
        return (<GoogleAuth />)
    }

    redirect('/form')
}
