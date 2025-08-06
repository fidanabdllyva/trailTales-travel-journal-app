import Header from "@/components/client/Header"
import { Outlet } from "react-router"

const ClientLayout = () => {
  return (
      <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  )
}

export default ClientLayout