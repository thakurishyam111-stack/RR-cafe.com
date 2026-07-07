"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BadgeDollarSign, CircleDollarSign, Receipt, Smartphone, Sparkles, UserRound, Search, Loader2 } from "lucide-react";

type CasherUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

type OrderItem = {
  name: string;
  quantity: number; // ब्याकेन्डको साविकको ढाँचा 'quantity'
  price: number;
};

type OrderData = {
  _id: string;
  billNo?: string;
  customerName: string;
  phone: string | number;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentStatus?: string;
  status?: string;
};

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

const Page = () => {
  // Cashier Details State
  const [casher, setCasher] = useState<CasherUser>({
    fullName: "Cashier",
    email: "No email available",
    phone: "No phone available",
  });

  // Search Inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // API Data & Loading States
  const [ordersList, setOrdersList] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  // Payment Input States
  const [cashGiven, setCashGiven] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");

  // १. पेज लोड हुँदा LocalStorage बाट क्यासियरको विवरण तान्ने
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem("casherUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as CasherUser;
        setCasher({
          id: parsed.id,
          fullName: parsed.fullName || "Cashier",
          email: parsed.email || "No email available",
          phone: parsed.phone || "No phone available",
        });
      } catch {
        // Fallback if fallback fails
      }
    }
  }, []);

  // २. API बाट अनपेइड अर्डरहरू खोज्ने (Fetch Order Function)
  const handleFindOrder = async () => {
    if (!customerName || !customerPhone) {
      setMessage("Please enter both Customer Name and Phone Number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setOrdersList([]); // पुराना खोजिएका लटहरू हटाउने

      const res = await axios.get("http://localhost:8080/api/orders");
      const allOrders = res.data.orders || [];

      const inputName = customerName.trim().toLowerCase();
      const inputPhone = customerPhone.trim();

      // 'paid' नभएका र विवरण मिल्ने अर्डरहरू मात्र फिल्टर गर्ने
      const matchedOrders = allOrders.filter((ord: OrderData) => {
        const dbName = ord.customerName ? ord.customerName.trim().toLowerCase() : "";
        const dbPhone = ord.phone ? ord.phone.toString().trim() : "";
        
        return dbName === inputName && dbPhone === inputPhone && ord.paymentStatus !== "paid";
      });

      if (matchedOrders.length > 0) {
        setOrdersList(matchedOrders);
      } else {
        setMessage("No active unpaid bills found for this customer.");
      }
    } catch (error) {
      setMessage("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 'approved' भएका बिलहरू मात्र छुट्ट्याउने
  const unpaidBills = useMemo(() => {
    return ordersList.filter((ord) => ord.status === "approved");
  }, [ordersList]);

  // ३. फेला परेका सबै बिलहरूको रकम हिसाब गर्ने (Calculations)
  const subtotal = useMemo(() => unpaidBills.reduce((sum, ord) => sum + (ord.subtotal || ord.total), 0), [unpaidBills]);
  const vatAmount = useMemo(() => unpaidBills.reduce((sum, ord) => sum + (ord.vat || 0), 0), [unpaidBills]);
  const rawGrandTotal = useMemo(() => unpaidBills.reduce((sum, ord) => sum + ord.total, 0), [unpaidBills]);

  const discount = (rawGrandTotal * Number(discountPercent || 0)) / 100;
  const payableAmount = rawGrandTotal - discount;
  const receivedAmount = Number(cashGiven || 0);
  const returnAmount = receivedAmount - payableAmount;

  // ४. भुक्तानी बुझाउने र डाटाहरू क्लियर गर्ने कार्य (Submit & Bulk Payment)
  const handleSubmitPayment = async (method: "Cash" | "eSewa" | "Khalti") => {
    if (unpaidBills.length === 0) return;

    // --- CASH PAYMENT ---
    if (method === "Cash") {
      if (receivedAmount < payableAmount) {
        alert("Insufficient cash given by customer!");
        return;
      }

      try {
        setPaying(true);
        
        // ब्याकेन्डमा सबै बिलहरू भुक्तानी भएको लुप चलाएर पठाउने
        const paymentPromises = unpaidBills.map((ord) =>
          axios.put(`http://localhost:8080/api/orders/payment/${ord._id}`, { 
            method,
            cashierId: casher?.id,
            discountPercent: Number(discountPercent)
          })
        );

        await Promise.all(paymentPromises);

        alert(`All ${unpaidBills.length} bill(s) paid successfully via Cash!`);
        
        // डाटा क्लियर गर्ने (Local States Clear)
        setOrdersList([]);
        setCustomerName("");
        setCustomerPhone("");
        setCashGiven("0");
        setDiscountPercent("0");
      } catch (error) {
        alert("Bulk payment failed. Please try again.");
      } finally {
        setPaying(false);
      }
      return;
    }

    // --- ONLINE PAYMENT (eSewa / Khalti) ---
    const appUrls = {
      eSewa: "https://esewa.com.np/#/home",
      Khalti: "https://web.khalti.com/",
    };

    const appUrl = appUrls[method];
    if (appUrl) {
      window.open(appUrl, "_blank");
      
      // गेटवेमा पठाउने बित्तिकै तत्कालै स्क्रिनबाट डाटा गायब बनाउने (Clear Local Data)
      setOrdersList([]);
      setCustomerName("");
      setCustomerPhone("");
      setCashGiven("0");
      setDiscountPercent("0");

      alert(`Redirecting to ${method} for ${unpaidBills.length} bill(s)...`);
    } else {
      alert("Payment method not supported.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Header Section */}
        <header className="mb-6 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                <Sparkles className="h-4 w-4" />
                POS / Cashier Dashboard
              </div>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Welcome back, {casher.fullName}
              </h1>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Search active orders via customer info, process payments securely, and refresh workflow in real-time.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{casher.fullName}</p>
                  <p className="text-sm text-slate-300">{casher.email}</p>
                  <p className="text-sm text-slate-300">{casher.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid */}
        <main className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          
          {/* Left Side: Search & Items Panel */}
          <section className="space-y-6">
            
            {/* Search Section */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Search</p>
                  <h2 className="text-xl font-semibold text-slate-900">Find Active Orders</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Customer Name
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Phone Number
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <button
                onClick={handleFindOrder}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" /> [ Find Order ]
                  </>
                )}
              </button>

              {message && (
                <div className="mt-3 text-center text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl">
                  {message}
                </div>
              )}
            </div>

            {/* Display Found Items Section */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order</p>
                  <h3 className="text-xl font-semibold text-slate-900">Current order items</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {unpaidBills.length} Bill(s) Matched
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {unpaidBills.length > 0 ? (
                  unpaidBills.map((ord) =>
                    ord.items?.map((item, index) => (
                      <div key={`${ord._id}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(item.quantity * item.price)}</p>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <p className="text-center text-sm py-6 text-slate-400">No live items to display. Use the search block above.</p>
                )}
              </div>
            </div>
          </section>

          {/* Right Side: Calculation & Actions Panel */}
          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 h-fit">
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
                    disabled={unpaidBills.length === 0}
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
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
                    disabled={unpaidBills.length === 0}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </label>

              {/* Bill Financial Structure Block (Inputs भन्दा ठीक तल र Submit भन्दा ठीक माथि) */}
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>VAT Amount</span>
                  <span>{formatCurrency(vatAmount)}</span>
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
                    {formatCurrency(unpaidBills.length > 0 && returnAmount > 0 ? returnAmount : 0)}
                  </span>
                </div>
              </div>
            </div>

            {unpaidBills.length > 0 && (
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
            )}

            {/* Action Buttons Group */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleSubmitPayment("Cash")}
                disabled={unpaidBills.length === 0 || paying}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {paying ? "Processing..." : "[ Submit Cash Payment ]"}
              </button>

              {unpaidBills.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSubmitPayment("eSewa")}
                    className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Pay via eSewa
                  </button>
                  <button
                    onClick={() => handleSubmitPayment("Khalti")}
                    className="rounded-2xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    Pay via Khalti
                  </button>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Page;