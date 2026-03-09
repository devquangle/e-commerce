import Login from "@/pages/auth/Login";
import Home from "@/pages/user/Home";
import { Navigate } from "react-router-dom";
import Register from './../pages/auth/Register';
import Products from "@/pages/user/Products";
import AccountLayout from "@/layouts/AccountLayout";

import Orders from "@/pages/user/Orders";
import Profile from "@/pages/auth/Profile";

import Address from "@/pages/user/Address";
import Favorites from "@/pages/user/Favorites";
import OrderDetails from "@/pages/user/OrderDetails";
import Carts from "@/pages/user/Carts";


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
    {
        path: "/products",
        element: <Products />,
    },
    {
        path: "/carts",
        element: <Carts />
    },
    {
        path: "/account",
        element: <AccountLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="profile" replace />
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "order/:id",
                element: <OrderDetails />,
            },
            {
                path: "address",
                element: <Address />,
            },
            {
                path: "favorites",
                element: <Favorites />,
            }
        ],
    },
];

export default userRouter;
