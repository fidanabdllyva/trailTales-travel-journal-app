import PastelParticleBackground from "@/components/AnimationThreeBg"
import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <>
     <PastelParticleBackground/>
    <Outlet/>
    </>
  )
}

export default AuthLayout