"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BadgeDollarSign, CircleDollarSign, Receipt, Smartphone, Sparkles, UserRound } from "lucide-react";

type CasherUser = {
  fullName?: string;
  email?: string;
  phone?: string;
};

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

const sampleItems: OrderItem[] = [
  { name: "Cappuccino", qty: 2, price: 180 },
  { name: "Chicken Burger", qty: 1, price: 650 },
  { name: "Fresh Juice", qty: 2, price: 220 },
];

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

const page = () => {
  const [casher, setCasher] = useState<CasherUser>({
    fullName: "Cashier",
    email: "No email available",
    phone: "No phone available",
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cashGiven, setCashGiven] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem("casherUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as CasherUser;
        setCasher({
          fullName: parsed.fullName || "Cashier",
          email: parsed.email || "No email available",
          phone: parsed.phone || "No phone available",
        });
      } catch {
        setCasher({
          fullName: "Cashier",
          email: "No email available",
          phone: "No phone available",
        });
      }
    }
  }, []);

  const subtotal = useMemo(() => sampleItems.reduce((sum, item) => sum + item.qty * item.price, 0), []);
  const discount = (subtotal * Number(discountPercent || 0)) / 100;
  const payableAmount = subtotal - discount;
  const receivedAmount = Number(cashGiven || 0);
  const returnAmount = receivedAmount - payableAmount;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                <Sparkles className="h-4 w-4" />
                POS / Cashier Dashboard
              </div>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Welcome back, {casher.fullName || "Cashier"}
              </h1>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Manage customer orders, capture contact details, and complete fast payment processing with a polished cashier experience.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{casher.fullName || "Cashier"}</p>
                  <p className="text-sm text-slate-300">{casher.email || "No email available"}</p>
                  <p className="text-sm text-slate-300">{casher.phone || "No phone available"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Customer</p>
                  <h2 className="text-xl font-semibold text-slate-900">Customer order details</h2>
                </div>
                <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  Live order
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Customer name
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Phone number
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <UserRound className="h-4 w-4 text-blue-600" />
                  <span>
                    Customer: <span className="font-semibold text-slate-900">{customerName || "Walk-in customer"}</span>
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span>
                    Contact: <span className="font-semibold text-slate-900">{customerPhone || "No phone added yet"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order</p>
                  <h3 className="text-xl font-semibold text-slate-900">Current order items</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {sampleItems.length} items
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {sampleItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Qty {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(item.qty * item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">Order payment summary</h2>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cash given
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">Rs.</span>
                  <input
                    type="number"
                    min="0"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Discount %
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </label>

              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>Discount</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 py-3 text-base font-semibold">
                  <span>Total payable</span>
                  <span>{formatCurrency(payableAmount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-white/10 px-3 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                    Return cash
                  </span>
                  <span className={`font-semibold ${returnAmount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {formatCurrency(Math.max(0, returnAmount))}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <BadgeDollarSign className="h-4 w-4" />
                Payment status
              </div>
              <p className="mt-2">
                {returnAmount >= 0
                  ? "Payment is ready to complete."
                  : "Customer cash is short by " + formatCurrency(Math.abs(returnAmount)) + "."}
              </p>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
              Print receipt
            </button>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default page;