/* eslint-disable react-hooks/exhaustive-deps */
import { RouterProvider } from "react-router";
import { router } from "../app/app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";

function App() {

  const auth = useAuth();

  // hydrateUser
  useEffect(() => {
      auth.handleGetme();
  }, [])
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
