import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { useState } from "react";
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header/>
      {/* SIDEBAR */}
      <Sidebar   isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="pt-20 sm:pt-24 sm:ml-64 px-4 pb-10 sm:px-8">
        <Outlet/>
      </main>
    </div>
  );
}

