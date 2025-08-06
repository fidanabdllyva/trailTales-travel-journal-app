import { createBrowserRouter, RouterProvider } from "react-router"
import ROUTES from "./routes";
import PastelParticleBackground from "./components/AnimationThreeBg";


const App = () => {
  const router = createBrowserRouter(ROUTES);
  return (
    <>
    <PastelParticleBackground/>
    <RouterProvider router={router} />
  </>
  )
}

export default App