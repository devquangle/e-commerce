import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UserLayout from "./layouts/UserLayout";
import userRouter from "./router/userRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {userRouter.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
