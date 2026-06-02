import Dashboard from "@/pages/admin/Dashboard";
import Genre from "@/pages/admin/Genre";
import Order from "@/pages/admin/Order";
import OrderItem from "@/pages/admin/Order-item";
import Product from "@/pages/admin/Product";
import Promotion from "@/pages/admin/Promotion";
import Revenue from "@/pages/admin/Revenue";
import TopProduct from "@/pages/admin/TopProduct";
import Review from "@/pages/admin/Review";
import Chat from "@/pages/admin/Chat";
import CreateProduct from "@/pages/admin/CreateProduct";
import UpdateProduct from "@/pages/admin/UpdateProduct";



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
    },
    {
        path :"/admin/order-items",
        element: <OrderItem />
    },
    {
        path :"/admin/analytics/revenue",
        element: <Revenue />
    },
    {
        path :"/admin/analytics/best-sellers",
        element: <TopProduct />
    },
    {
        path :"/admin/reviews",
        element: <Review />
    },
    {
        path :"/admin/chats",
        element: <Chat />
    },
        {
        path :"/admin/add-product",
        element: <CreateProduct />
    },
        {
        path :"/admin/edit-product/:id",
        element: <UpdateProduct />
    },

]

export default adminRouter;