import Header from "@/components/client/Header"
import { Outlet } from "react-router"

const ClientLayout = () => {
  return (
    <>
      <Header />


      <Outlet />


    </>
  )
}

export default ClientLayout