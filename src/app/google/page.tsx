import GoogleAuth from "@/components/google.auth";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Page() {
    const { hasToken } = await verifySession()

    if (!hasToken) {
        return (<GoogleAuth/>)
    }

    redirect('/form')
}
