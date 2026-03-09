import Header from "@/components/admin/Header";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header/>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-slate-200 bg-slate-950 text-slate-100 pt-16 shadow-xl shadow-slate-900/30 transition-transform rounded-r-3xl sm:rounded-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Overview
            </p>
          </div>

          <nav className="flex-1 space-y-1 text-sm font-medium">
            <button className="flex w-full items-center gap-3 rounded-xl bg-slate-900 px-3 py-2 text-slate-50 shadow-sm shadow-slate-900/40">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/90 text-sm">
                📊
              </span>
              <span>Dashboard</span>
              <span className="ml-auto rounded-full bg-indigo-500/20 px-2 text-[11px] font-semibold text-indigo-300">
                Live
              </span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-900/70 hover:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm">
                📦
              </span>
              <span>Orders</span>
              <span className="ml-auto rounded-full bg-amber-500/10 px-2 text-[11px] font-medium text-amber-300">
                24 new
              </span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-900/70 hover:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm">
                🛒
              </span>
              <span>Products</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-900/70 hover:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm">
                👤
              </span>
              <span>Customers</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-300 hover:bg-slate-900/70 hover:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm">
                ⚙️
              </span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="mt-6 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-3 text-xs text-slate-300">
            <p className="mb-1 font-semibold text-slate-50">
              Upgrade to Pro
            </p>
            <p className="mb-2 text-[11px] text-slate-400">
              Unlock advanced analytics, custom reports and priority support.
            </p>
            <button className="inline-flex items-center rounded-lg bg-indigo-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-indigo-400">
              Upgrade now
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="pt-20 sm:pt-24 sm:ml-64 px-4 pb-10 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* PAGE HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
                Today&apos;s overview
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor your store performance, orders and customers in real
                time.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600">
                Last 30 days
              </button>
              <button className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                Export report
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Total revenue
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    $24,980
                  </p>
                  <p className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    ↑ 18% vs last month
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-lg text-indigo-500">
                  💰
                </span>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Orders
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    1,284
                  </p>
                  <p className="mt-1 inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                    62 pending fulfillment
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-lg text-sky-500">
                  📦
                </span>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Active customers
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    3,742
                  </p>
                  <p className="mt-1 inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                    ↑ 230 new this week
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-lg text-rose-500">
                  👥
                </span>
              </div>
            </article>
          </section>

          {/* CHART + SECONDARY CONTENT */}
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Revenue trend
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Placeholder area for your chart component.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Live preview
                </span>
              </div>
              <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400">
                Chart Area
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Conversion
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  3.84%
                </p>
                <p className="mt-1 text-xs text-indigo-600">
                  ↑ 0.42% vs last week
                </p>
                <div className="mt-4 h-1.5 rounded-full bg-slate-100">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-500 shadow-sm shadow-slate-200">
                <p className="font-medium text-slate-800">
                  Tips to grow faster
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Optimize product pages with clear photos.</li>
                  <li>Send targeted campaigns to repeat buyers.</li>
                  <li>Highlight free shipping &amp; returns.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

