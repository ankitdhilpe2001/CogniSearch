import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import PublicRoute from "../features/auth/components/PublicRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/dashboard",
        element: (
            <Protected>
                <Dashboard />
            </Protected>
        ),
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
])
