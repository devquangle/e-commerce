import Login from "@/pages/auth/Login";
import Home from "@/pages/user/Home";

const userRouter = [
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
];

export default userRouter;
