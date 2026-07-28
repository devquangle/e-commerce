import { Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./providers/AuthProvider";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
