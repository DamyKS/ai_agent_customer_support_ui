import { Outlet } from "react-router-dom"
import { Header } from "../components/Header"
import { AppSidebar } from "../components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
