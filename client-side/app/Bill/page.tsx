"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BillPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH ORDER
  // ======================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:8080/api/orders"
        );

        const foundOrder = res.data.orders.find(
          (o) => o._id === id
        );

        setOrder(foundOrder);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ======================
  // LOADING UI
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Generating Bill...
      </div>
    );
  }

  // ======================
  // NOT FOUND
  // ======================
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Order Not Found
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-green-400">
          RR Cafe Bill
        </h1>

        <p className="text-center text-gray-400 text-sm mt-1">
          Thank you for your order ☕
        </p>

        <hr className="my-4 border-gray-700" />

        {/* CUSTOMER INFO */}
        <div className="text-sm space-y-1">
          <p>
            <span className="text-gray-400">Customer:</span>{" "}
            {order.customerName}
          </p>
          <p>
            <span className="text-gray-400">Phone:</span>{" "}
            {order.phone}
          </p>
          <p>
            <span className="text-gray-400">Table:</span>{" "}
            {order.number}
          </p>
        </div>

        <hr className="my-4 border-gray-700" />

        {/* ITEMS */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>
                Rs {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4 border-gray-700" />

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-bold text-green-400">
          <span>Total</span>
          <span>Rs {order.total}</span>
        </div>

        {/* PAYMENT SECTION */}
        <div className="mt-6">
          <p className="text-center text-gray-300 mb-3">
            Pay via
          </p>

          <div className="flex justify-center gap-6">

            {/* ESEWA */}
            <div className="flex flex-col items-center">
              <Image
                src="/esewa.png"
                alt="eSewa"
                width={70}
                height={70}
              />
              <span className="text-xs mt-1">eSewa</span>
            </div>

            {/* KHALTI */}
            <div className="flex flex-col items-center">
              <Image
                src="/khalti.png"
                alt="Khalti"
                width={70}
                height={70}
              />
              <span className="text-xs mt-1">Khalti</span>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by RR Cafe System
        </p>

      </div>

    </div>
  );
}