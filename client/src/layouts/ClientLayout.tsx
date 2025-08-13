import Header from "@/components/client/Header"
import { Outlet } from "react-router"

const ClientLayout = () => {
  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen">
        <Outlet />
      </div>


    </>
  )
}

export default ClientLayout