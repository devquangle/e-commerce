import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UserLayout from "./layouts/UserLayout";
import userRouter from "./router/userRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<UserLayout />}>
          {userRouter.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            >
              {/* Nếu route có children, map vào ở đây */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
