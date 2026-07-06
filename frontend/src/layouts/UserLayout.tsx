import Header from '@/components/user/Header'
import Footer from '@/components/user/Footer'
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="bg-slate-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

