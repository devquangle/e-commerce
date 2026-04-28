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
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Role } from "@/types/role";
import RegisterConfirm from "@/pages/user/RegisterConfirm";
import CreateAddress from "@/pages/user/CreateAddress";


const userRouter = [
    {
        path: "/",
        element: <Navigate to="/home" replace />,
    },
    {
        path: "/verify_email",
        element: <RegisterConfirm />,
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
        element: 
        <ProtectedRoute requiredRoles={[Role.CUSTOMER]}>
            <AccountLayout />
        </ProtectedRoute>,
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
                path: "create-address",
                element: <CreateAddress />,
            },
            {
                path: "favorites",
                element: <Favorites />,
            }
        ],
    },
];

export default userRouter;
