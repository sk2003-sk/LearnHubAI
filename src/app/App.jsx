import { RouterProvider } from "react-router-dom";
import AppProviders from "./providers";
import router from "./router";
import { Toaster } from "sonner";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProviders>
  );
}

export default App;
