import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )

}


