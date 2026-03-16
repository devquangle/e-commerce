import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import Container from "@/components/Container";
import { useState } from "react";
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="w-full sm:pl-64">
        <Container className="px-2 md:px-4 py-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

