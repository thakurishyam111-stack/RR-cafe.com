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
        `http://localhost:8080/api/orders/billNo/${billNo}`,
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
            Royal Cafe.com
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

          <hr className="my-4 border-gray-500" />

          {/* BLOCK IF NOT APPROVED */}
          {order.status !== "approved" ? (
            <p className="text-center text-yellow-400">
              ⏳ Your order is not approved yet
            </p>
          ) : (
            <>
              {/* CUSTOMER INFO */}
              <div className="text-xl space-y-1 text-center">
                <p>Customer: {order.customerName}</p>
                <p>Phone: {order.phone}</p>
                <p>Table: {order.number}</p>
              </div>

              <hr className="my-4 border-gray-500" />

              {/* ITEMS */}
              <div className="space-y-2 text-xl">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between ">
                    <span className="text-xl">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="text-green-400 ">Rs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-700" />

              {/* TOTAL */}
              <div className="flex justify-between font-bold text-green-400">
                <span>Total</span>
                <span>Rs. {order.total}</span>
              </div>

              {/* PAYMENT */}
              {order.paymentStatus !== "Paid" && (
                <div className="mt-5">
                  <p className="text-xl text-center mb-3 text-gray-100">Pay via</p>

                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => handlePayment("eSewa")}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="data:image/jpeg;base64,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"
                        width={60}
                        height={60}
                        alt="e-Sewa"
                        className="flex items-center rounded-full "
                      />
                      <span className="text-l mt-1">e-Sewa</span>
                    </button>

                    <button
                      onClick={() => handlePayment("Khalti")}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="data:image/png;base64,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"
                        width={60}
                        height={60}
                        alt="Khalti"
                     className="rounded-full "  />
                      <span className="text-l mt-1">Khalti</span>
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
