import Dashboard from "@/pages/admin/Dashboard";
import Genre from "@/pages/admin/Genre";
import Order from "@/pages/admin/Order";
import OrderItem from "@/pages/admin/Order-item";
import Product from "@/pages/admin/ProductPage";
import Promotion from "@/pages/admin/Promotion";
import Revenue from "@/pages/admin/Revenue";
import TopProduct from "@/pages/admin/TopProduct";
import Review from "@/pages/admin/Review";
import Chat from "@/pages/admin/Chat";
import CreateProduct from "@/pages/admin/CreateProduct";
import UpdateProduct from "@/pages/admin/UpdateProduct";
import AuthorPage from "@/pages/admin/AuthorPage";
import PublisherPage from "@/pages/admin/PublisherPage";
import SeriesPage from "@/pages/admin/SeriesPage";
import VoucherPage from "@/pages/admin/VoucherPage";
import CreatePromotion from "@/pages/admin/CreatePromotion";
import UpdatePromotion from "@/pages/admin/UpdatePromotion";
import { Navigate } from "react-router-dom";

const adminRouter = [
  {
    path: "",
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "products",
    element: <Product />,
  },
  {
    path: "genres",
    element: <Genre />,
  },
  {
    path: "promotions",
    element: <Promotion />,
  },
  {
    path: "vouchers",
    element: <VoucherPage />,
  },
  {
    path: "orders",
    element: <Order />,
  },
  {
    path: "order-items",
    element: <OrderItem />,
  },
  {
    path: "analytics/revenue",
    element: <Revenue />,
  },
  {
    path: "analytics/best-sellers",
    element: <TopProduct />,
  },
  {
    path: "reviews",
    element: <Review />,
  },
  {
    path: "chats",
    element: <Chat />,
  },
  {
    path: "add-product",
    element: <CreateProduct />,
  },
  {
    path: "edit-product/:id",
    element: <UpdateProduct />,
  },
  {
    path: "add-promotion",
    element: <CreatePromotion />,
  },
  {
    path: "edit-promotion/:id",
    element: <UpdatePromotion />,
  },
  {
    path: "authors",
    element: <AuthorPage />,
  },
  {
    path: "publishers",
    element: <PublisherPage />,
  },
  {
    path: "collections",
    element: <SeriesPage />,
  },
];

export default adminRouter;
