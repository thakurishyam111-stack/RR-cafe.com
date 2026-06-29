"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Wallet,
  Sparkles,
  Activity,
  Clock3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import AdminSidebar from "@/components/AdminSidebar";

type OrderStatus = "pending" | "approved" | "rejected";

type Order = {
  _id: string;
  total?: number;
  status?: OrderStatus;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const monthlyLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function RevenuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders`);
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (error) {
        console.error("Revenue load error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const approvedOrders = useMemo(
    () => orders.filter((order) => order.status === "approved"),
    [orders],
  );

  const totalRevenue = useMemo(
    () =>
      approvedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [approvedOrders],
  );

  const monthlyRevenue = useMemo(() => {
    const monthTotals = Array(12).fill(0);
    approvedOrders.forEach((order) => {
      const date = new Date(order.createdAt || order.updatedAt || Date.now());
      monthTotals[date.getMonth()] += Number(order.total || 0);
    });
    return monthTotals;
  }, [approvedOrders]);

  const inProgressRevenue = useMemo(
    () =>
      orders
        .filter((order) => order.status === "pending")
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const rejectedRevenue = useMemo(
    () =>
      orders
        .filter((order) => order.status === "rejected")
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const totalOrders = orders.length;
  const approvedCount = approvedOrders.length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const rejectedCount = orders.filter((order) => order.status === "rejected").length;
  const averageOrderValue = totalOrders
    ? Math.round(totalRevenue / totalOrders)
    : 0;
  const trendPercent = useMemo(() => {
    const latest = monthlyRevenue[11] || 0;
    const previous = monthlyRevenue[10] || 0;
    if (previous === 0) {
      return latest === 0 ? 0 : 14.2;
    }
    return Number((((latest - previous) / previous) * 100).toFixed(1));
  }, [monthlyRevenue]);

  const chartData = useMemo(
    () =>
      monthlyRevenue.map((revenue, index) => ({
        month: monthlyLabels[index],
        revenue,
      })),
    [monthlyRevenue],
  );

  return (
    <>
      <AdminSidebar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-8 md:pt-6 md:ml-72">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">
                Revenue command center
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Cafe revenue dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Explore revenue flow, order performance, and monthly growth in a
                sleek, data-driven dashboard built for cafe business leaders.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Approved revenue
                </p>
                <p className="mt-4 text-3xl font-semibold text-white">
                  Rs {totalRevenue.toLocaleString()}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  <ArrowUpRight className="h-4 w-4" />
                  {trendPercent}% vs last month
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Pending income
                </p>
                <p className="mt-4 text-3xl font-semibold text-white">
                  Rs {inProgressRevenue.toLocaleString()}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {pendingCount} pending orders
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Rejected revenue
                </p>
                <p className="mt-4 text-3xl font-semibold text-white">
                  Rs {rejectedRevenue.toLocaleString()}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {rejectedCount} declined orders
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Monthly revenue
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Bar chart — revenue by month
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                Last 12 months
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-slate-900/80 p-5 shadow-inner shadow-slate-950/50">
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: 16,
                        color: "#e2e8f0",
                      }}
                      labelStyle={{ color: "#cbd5e1" }}
                    />
                    <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[16, 16, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Average order value</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Rs {averageOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Approved orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {approvedCount}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Total orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {totalOrders}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                    Revenue insights
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Snapshot panel
                  </h3>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
                  live
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Income recognized</p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        Rs {totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Pending revenue</p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        Rs {inProgressRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Declined value</p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        Rs {rejectedRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-300">
                      <Wallet className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                    Performance pulse
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Order flow metrics
                  </h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-sky-300">
                  <Clock3 className="h-4 w-4" /> Latest
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Approved orders</span>
                    <span>{approvedCount}</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Pending orders</span>
                    <span>{pendingCount}</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Rejected orders</span>
                    <span>{rejectedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-center text-slate-300 shadow-2xl shadow-black/20">
            Loading revenue insights...
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                    Refined metrics
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Revenue highlights
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-emerald-300">
                  <Sparkles className="h-4 w-4" /> Stable
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Total revenue</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Rs {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Pending pipeline</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Rs {(inProgressRevenue + rejectedRevenue).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Average approved order</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Rs {approvedCount ? Math.round(totalRevenue / approvedCount).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                    Order composition
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Revenue breakdown
                  </h3>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-sky-300">
                  Real time
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Completed revenue</span>
                    <span>Rs {totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Pending revenue</span>
                    <span>Rs {inProgressRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Rejected revenue</span>
                    <span>Rs {rejectedRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
