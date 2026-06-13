"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function BillPage() {
  const [billNo, setBillNo] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ======================
  // FETCH BILL
  // ======================
  const fetchBill = async () => {
    if (!billNo) {
      setMessage("Please enter Bill Number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setOrder(null);

      const res = await axios.get(
        `http://localhost:8080/api/orders/order/${billNo}`,
      );

      setOrder(res.data.order);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Bill Not Found");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // PAY (SIMULATION)
  // ======================
  const handlePayment = async (method) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/pay/${order._id}`, {
        method,
      });

      setOrder({ ...order, paymentStatus: "Paid" });
      alert(`Payment Successful via ${method}`);
    } catch (error) {
      alert("Payment Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* INPUT SECTION */}
      <div className="w-full max-w-md bg-gray-800 p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center text-green-400">
          Cafe Billing System
        </h2>

        <input
          type="text"
          placeholder="Enter Bill No (e.g. CAF-0001)"
          value={billNo}
          onChange={(e) => setBillNo(e.target.value)}
          className="w-full mt-4 p-2 rounded bg-gray-700 text-white"
        />

        <button
          onClick={fetchBill}
          className="w-full mt-3 bg-green-500 hover:bg-green-600 p-2 rounded"
        >
          Search Bill
        </button>

        {message && (
          <p className="text-red-400 text-sm mt-2 text-center">{message}</p>
        )}
      </div>

      {/* LOADING */}
      {loading && <p className="mt-6 text-gray-300">Loading bill...</p>}

      {/* BILL CARD */}
      {order && (
        <div className="w-full max-w-md bg-gray-800 mt-6 p-6 rounded-2xl shadow-xl">
          {/* HEADER */}
          <h1 className="text-2xl font-bold text-center text-green-400">
            Royal Cafe Bill
          </h1>

          <p className="text-center text-gray-400 text-sm">
            Bill No: {order.billNo}
          </p>

          {/* STATUS */}
          <div className="text-center mt-2">
            <span
              className={`px-3 py-1 rounded text-xs ${
                order.status === "approved" ? "bg-green-600" : "bg-yellow-600"
              }`}
            >
              {order.status}
            </span>
            <span
              className={`ml-2 px-3 py-1 rounded text-xs ${
                order.paymentStatus === "Paid" ? "bg-blue-600" : "bg-red-600"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <hr className="my-4 border-gray-700" />

          {/* BLOCK IF NOT APPROVED */}
          {order.status !== "approved" ? (
            <p className="text-center text-yellow-400">
              ⏳ Your order is not approved yet
            </p>
          ) : (
            <>
              {/* CUSTOMER INFO */}
              <div className="text-sm space-y-1">
                <p>Customer: {order.customerName}</p>
                <p>Phone: {order.phone}</p>
                <p>Table: {order.number}</p>
              </div>

              <hr className="my-4 border-gray-700" />

              {/* ITEMS */}
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>Rs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-700" />

              {/* TOTAL */}
              <div className="flex justify-between font-bold text-green-400">
                <span>Total</span>
                <span>Rs {order.total}</span>
              </div>

              {/* PAYMENT */}
              {order.paymentStatus !== "Paid" && (
                <div className="mt-5">
                  <p className="text-center mb-3 text-gray-300">Pay via</p>

                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => handlePayment("eSewa")}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="/esewa.png"
                        width={60}
                        height={60}
                        alt="eSewa"
                      />
                      <span className="text-xs mt-1">eSewa</span>
                    </button>

                    <button
                      onClick={() => handlePayment("Khalti")}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="/khalti.png"
                        width={60}
                        height={60}
                        alt="Khalti"
                      />
                      <span className="text-xs mt-1">Khalti</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PAID MESSAGE */}
              {order.paymentStatus === "Paid" && (
                <p className="text-center text-blue-400 mt-4">
                  ✅ Payment Completed
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
