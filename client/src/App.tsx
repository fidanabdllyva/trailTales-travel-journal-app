import { createBrowserRouter, RouterProvider } from "react-router"
import ROUTES from "./routes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store";


const App = () => {
  const router = createBrowserRouter(ROUTES);
  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router} />
    <Toaster position="bottom-right" richColors />
    </Provider>
  </>
  )
}

export default App