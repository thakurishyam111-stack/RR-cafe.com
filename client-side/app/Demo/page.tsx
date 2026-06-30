"use client";

import React, { useState } from "react";
import axios from "axios";

export default function BillWidget() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [ordersList, setOrdersList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false); // सामूहिक भुक्तानीको लागि लोडइङ स्टेट

  // ======================
  // FETCH ALL BILLS FOR CUSTOMER
  // ======================
  const fetchBill = async () => {
    if (!customerName || !phone) {
      setMessage("Please enter both Name and Phone Number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setOrdersList([]);

      const res = await axios.get("http://localhost:8080/api/orders");
      const allOrders = res.data.orders || [];

      const inputName = customerName.trim().toLowerCase();
      const inputPhone = phone.trim();

      const matchedOrders = allOrders.filter((ord) => {
        const dbName = ord.customerName ? ord.customerName.trim().toLowerCase() : "";
        const dbPhone = ord.phone ? ord.phone.toString().trim() : "";
        return dbName === inputName && dbPhone === inputPhone;
      });

      if (matchedOrders.length > 0) {
        setOrdersList(matchedOrders);
      } else {
        setMessage("No bills found for this name and phone number");
      }
    } catch (error) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Unpaid र Approved भएका बिलहरू मात्र फिल्टर गर्ने (भुक्तानी गर्न योग्य बिलहरू)
  const unpaidBills = ordersList.filter(
    (ord) => ord.paymentStatus !== "paid" && ord.status === "approved"
  );

  // सबै Unpaid बिलहरूको कुल जम्मा रकम (Grand Total)
  const grandTotal = unpaidBills.reduce((sum, ord) => sum + ord.total, 0);

  // ======================
  // PAY ALL UNPAID BILLS AT ONCE (Senior Bulk Request Approach)
  // ======================
  const handleBulkPayment = async (method) => {
    if (unpaidBills.length === 0) return;

    if (method === "Cash") {
      try {
        setPaying(true);
        
        // Promise.all ले सबै Unpaid बिलहरूको API Request एकै पटक ब्याकइन्डमा पठाउँछ
        const paymentPromises = unpaidBills.map((ord) =>
          axios.put(`http://localhost:8080/api/orders/payment/${ord._id}`, { method })
        );

        const responses = await Promise.all(paymentPromises);
        
        // ब्याकइन्डबाट आएका नयाँ अपडेटेड अर्डरहरू अपडेट गर्ने
        const updatedOrders = responses.map((res) => res.data.order);

        setOrdersList((prevList) =>
          prevList.map((ord) => {
            const foundUpdated = updatedOrders.find((u) => u._id === ord._id);
            return foundUpdated ? foundUpdated : ord;
          })
        );

        alert(`All ${unpaidBills.length} bills paid successfully via Cash!`);
      } catch (error) {
        alert("Bulk payment failed. Please try again.");
      } finally {
        setPaying(false);
      }
      return;
    }

    // eSewa / Khalti Simulation
    const appUrls = {
      eSewa: "https://esewa.com.np/#/home",
      Khalti: "https://web.khalti.com/",
    };

    const appUrl = appUrls[method];
    if (appUrl) {
      window.open(appUrl, "_blank");
    } else {
      alert("Payment method not supported.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 text-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300">
      
      {/* INPUT SECTION */}
      <div className="bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm">
        <h2 className="text-lg font-bold text-center text-blue-400 tracking-wide">
          <i>Mero Deurali Cafe</i>
        </h2>
        <p className="text-xs text-center text-gray-400 mb-4">View & Pay All Bills</p>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={fetchBill}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold p-2.5 rounded-lg text-sm transition-all shadow-md"
        >
          {loading ? "Searching..." : "Search Bills"}
        </button>

        {message && (
          <p className="text-red-400 text-xs mt-2.5 text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">
            {message}
          </p>
        )}
      </div>

      {/* INDIVIDUAL BILL CARDS */}
      {ordersList.length > 0 && (
        <div className="mt-4 space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {ordersList.map((order) => {
            const isUnpaidAndNotApproved = order.status !== "approved" && order.paymentStatus !== "paid";

            return (
              <div key={order._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-gray-200">Table: {order.number}</h3>
                    <p className="text-gray-400 text-[10px]">Bill No: {order.billNo}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-bold ${
                      order.status === "approved" ? "bg-green-600/30 text-green-400 border border-green-500/30" : "bg-yellow-600/30 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-bold ${
                      order.paymentStatus === "paid" ? "bg-blue-600/30 text-blue-400 border border-blue-500/30" : "bg-red-600/30 text-red-400 border border-red-500/30"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <hr className="my-2 border-gray-700" />

                {isUnpaidAndNotApproved ? (
                  <p className="text-center text-xs text-yellow-400 py-1">
                    ⏳ Awaiting approval
                  </p>
                ) : (
                  <>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-gray-300">
                          <span>{item.title} <span className="text-gray-500">× {item.quantity}</span></span>
                          <span className="font-semibold text-blue-400">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="my-2 border-gray-700" />
                    <div className="flex justify-between font-bold text-xs text-green-400">
                      <span>Amount</span>
                      <span>Rs. {order.total}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BULK PAYMENT BOTTOM BAR (देखिनेछ जब Unpaid बिलहरू हुन्छन्) */}
      {unpaidBills.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-xl border border-blue-500/30 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-400">Total Unpaid Bills ({unpaidBills.length})</p>
              <h3 className="text-sm font-bold text-gray-200">Grand Total</h3>
            </div>
            <span className="text-lg font-extrabold text-green-400">Rs. {grandTotal}</span>
          </div>

          <p className="text-[10px] text-center mb-2.5 text-gray-400 uppercase tracking-wider font-semibold">
            Pay All {unpaidBills.length} Bills Securely via
          </p>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => handleBulkPayment("Cash")} 
              disabled={paying}
              className="flex-1 text-xs font-bold text-gray-200 bg-gray-700 hover:bg-gray-600 py-2 px-3 rounded-lg transition-all disabled:opacity-50"
            >
              {paying ? "Paying..." : "💵 Cash All"}
            </button>
            <button 
              onClick={() => handleBulkPayment("eSewa")} 
              disabled={paying}
              className="flex-1 text-xs font-bold text-green-400 bg-green-950/40 border border-green-900/50 hover:bg-green-900/30 py-2 px-3 rounded-lg transition-all disabled:opacity-50"
            >
              💚 eSewa All
            </button>
            <button 
              onClick={() => handleBulkPayment("Khalti")} 
              disabled={paying}
              className="flex-1 text-xs font-bold text-purple-400 bg-purple-950/40 border border-purple-900/50 hover:bg-purple-900/30 py-2 px-3 rounded-lg transition-all disabled:opacity-50"
            >
              💜 Khalti All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}