import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import Container from "@/components/common/Container";
import { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("admin-no-body-scroll");

    return () => {
      document.body.classList.remove("admin-no-body-scroll");
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 ">
      <Header />
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="h-[calc(100vh-60px)] w-full overflow-y-auto md:pl-64">
        <Container className="p-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
