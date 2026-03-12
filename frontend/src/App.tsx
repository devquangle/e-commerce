import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UserLayout from "./layouts/UserLayout";
import userRouter from "./router/userRouter";
import AdminLayout from "./layouts/AdminLayout";
import adminRouter from "./router/adminRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 60,
        }}
      />
      <Routes>
        <Route element={<UserLayout />}>
          {userRouter.map((route) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child) => (
                <Route
                  key={child.path || "index"}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          {adminRouter.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            ></Route>
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
