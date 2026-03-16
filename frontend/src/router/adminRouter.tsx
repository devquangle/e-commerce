import Dashboard from "@/pages/admin/Dashboard";
import Genre from "@/pages/admin/Genre";
import Order from "@/pages/admin/Order";
import Product from "@/pages/admin/Product";
import Promotion from "@/pages/admin/Promotion";



const adminRouter = [
    {
        path :"/admin/dashboard",
        element: <Dashboard />
    },
    {
        path :"/admin/products",
        element: <Product />
    },
    {
        path :"/admin/genres",
        element: <Genre />
    },
    {
        path :"/admin/promotions",
        element: <Promotion />
    },{
        path :"/admin/orders",
        element: <Order />
    }

]

export default adminRouter;