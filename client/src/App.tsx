import { createBrowserRouter, RouterProvider } from "react-router"
import ROUTES from "./routes";
import { Toaster } from "sonner";


const App = () => {
  const router = createBrowserRouter(ROUTES);
  return (
    <>
    <Toaster position="bottom-right" richColors />
    <RouterProvider router={router} />
  </>
  )
}

export default App