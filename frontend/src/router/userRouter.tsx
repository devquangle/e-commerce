import Login from "@/pages/auth/Login";
import Home from "@/pages/user/Home";
import { Navigate } from "react-router-dom";
import Register from './../pages/auth/Register';

const userRouter = [
    {
        path: "/",
        element: <Navigate to="/home" replace />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
     {
        path: "/register",
        element: <Register />,
    },
];

export default userRouter;
