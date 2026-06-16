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
} from "lucide-react";
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

  const changePercent = 8.4;

  return (
    <>
      <AdminSidebar />

      <main className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-500 to-slate-950 text-white p-4 md:p-8 md:pt-6 md:ml-72">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Sales & Revenue
            </h1>
            <p className="mt-2 max-w-2xl text-gray-300">
              Monitor order revenue flow, income growth, and real-time sales
              performance across the cafe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/10 backdrop-blur-md">
              <p className="text-sm text-gray-100">Approved revenue</p>
              <p className="mt-3 text-3xl font-semibold">
                Rs. {totalRevenue.toLocaleString()}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-white text-xs font-medium">
                <ArrowUpRight className="h-4 w-4" /> {changePercent}% vs last
                month
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/10 backdrop-blur-md">
              <p className="text-sm text-gray-90">Pending orders</p>
              <p className="mt-3 text-3xl font-semibold">
                {orders.filter((order) => order.status === "pending").length}
              </p>
              <p className="mt-2 text-sm text-gray-100">
                Rs {inProgressRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 border border-white/10 p-4 shadow-lg shadow-black/10 backdrop-blur-md">
              <p className="text-sm text-gray-100">Rejected revenue</p>
              <p className="mt-3 text-3xl font-semibold">
                Rs {rejectedRevenue.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-90">
                from{" "}
                {orders.filter((order) => order.status === "rejected").length}{" "}
                orders
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[2rem] bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-white/10 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">
                  Revenue trend
                </p>
                <h2 className="text-2xl font-semibold mt-2">
                  Monthly income flow
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <CalendarDays className="h-4 w-4 text-emerald-300" /> Last 12
                months
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="flex items-end gap-3 overflow-hidden rounded-[1.5rem] bg-slate-900/70 p-5">
                {monthlyRevenue.map((value, index) => {
                  const height = Math.min(
                    240,
                    value === 0
                      ? 18
                      : Math.max(
                          18,
                          (value / Math.max(...(monthlyRevenue || [1]))) * 240,
                        ),
                  );
                  return (
                    <div
                      key={monthlyLabels[index]}
                      className="flex-1 text-center"
                    >
                      <div
                        className="mx-auto mb-2 h-0 w-2 rounded-full bg-blue-500/40"
                        style={{ height: `${height}px` }}
                      />
                      <p className="text-xs text-gray-200">
                        {monthlyLabels[index]}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    Average order value
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Rs{" "}
                    {orders.length
                      ? Math.round(
                          totalRevenue / orders.length,
                        ).toLocaleString()
                      : 0}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm text-gray-400">Approved orders</p>
                  <p className="mt-2 text-xl font-semibold">
                    {approvedOrders.length}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm text-gray-400">Total orders</p>
                  <p className="mt-2 text-xl font-semibold">{orders.length}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-white/10 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                  Revenue flow
                </p>
                <h2 className="text-2xl font-semibold mt-2">
                  Order income stream
                </h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
                live view
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Income recognized</p>
                    <p className="mt-2 text-3xl font-semibold">
                      Rs {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400">Revenue pipeline</p>
                    <p className="mt-2 text-lg font-semibold text-gray-100">
                      Rs{" "}
                      {(inProgressRevenue + rejectedRevenue).toLocaleString()}
                    </p>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm text-gray-400">
                  Real-time order composition
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Completed revenue</span>
                      <span>Rs {totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Pending income</span>
                      <span>Rs {inProgressRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Declined value</span>
                      <span>Rs {rejectedRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">
                Revenue sources
              </p>
              <h2 className="text-2xl font-semibold mt-2">
                Income breakdown by order type
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                Approved
              </span>
              <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
                Pending
              </span>
              <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300">
                Rejected
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm text-gray-400">Revenue earned</p>
              <p className="mt-3 text-2xl font-semibold">
                Rs {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm text-gray-400">Pending income</p>
              <p className="mt-3 text-2xl font-semibold">
                Rs {inProgressRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm text-gray-400">Rejected lost</p>
              <p className="mt-3 text-2xl font-semibold">
                Rs {rejectedRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white/5 border border-white/10 p-6 text-center text-gray-300">
            Loading revenue data...
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                    Income velocity
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Order revenue flow
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-emerald-300">
                  <BarChart3 className="h-4 w-4" /> Trend
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="space-y-3">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Total orders</span>
                      <span>{orders.length}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Approved orders</span>
                      <span>{approvedOrders.length}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Pending orders</span>
                      <span>
                        {
                          orders.filter((order) => order.status === "pending")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                    Revenue insight
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Order income breakdown
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-sky-300">
                  <Wallet className="h-4 w-4" /> Income
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Average value per approved order</span>
                    <span>
                      Rs{" "}
                      {approvedOrders.length
                        ? Math.round(
                            totalRevenue / approvedOrders.length,
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Average total order amount</span>
                    <span>
                      Rs{" "}
                      {orders.length
                        ? Math.round(
                            (approvedOrders.reduce(
                              (sum, order) => sum + Number(order.total || 0),
                              0,
                            ) +
                              inProgressRevenue +
                              rejectedRevenue) /
                              orders.length,
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Most active month</span>
                    <span>
                      {monthlyLabels[
                        monthlyRevenue.indexOf(Math.max(...monthlyRevenue))
                      ] || "N/A"}
                    </span>
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
