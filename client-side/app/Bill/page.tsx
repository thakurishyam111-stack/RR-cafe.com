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
                      src={"data:image/png;base64,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"}
                        width={60}
                        height={60}
                        alt="e-Sewa"
                        className=" rounded-full  "
                      />
                      <span className="text-l mt-1">e-Sewa</span>
                    </button>

                    <button
                      onClick={() => handlePayment("Khalti")}
                      className="flex flex-col items-center"
                    >
                      <Image
                      src={"data:image/png;base64,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"}
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
