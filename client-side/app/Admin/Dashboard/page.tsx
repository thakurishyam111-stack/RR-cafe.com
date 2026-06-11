"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Wallet,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // AUTH CHECK
  // ======================
  useEffect(() => {
    // const token = localStorage.getItem("adminToken");

    // if (!token) {
    //   router.push("/Admin/Dashboard");
    //   return;
    // }

    fetchOrders();
  }, []);

  // ======================
  // FETCH ORDERS
  // ======================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/api/orders");

      console.log("API DATA:", res.data);

      const data = res.data?.orders;

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Fetch Error:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // APPROVE ORDER
  // ======================
  const approveOrder = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.log("Approve Error:", err.message);
    }
  };

  // ======================
  // REJECT ORDER
  // ======================
  const rejectOrder = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.log("Reject Error:", err.message);
    }
  };

  // ======================
  // SAFE DATA
  // ======================
  const safeOrders = Array.isArray(orders) ? orders : [];

  // ======================
  // STATS
  // ======================
  const totalOrders = safeOrders.length;

  const pendingOrders = safeOrders.filter(
    (o) => o.status === "pending"
  ).length;

  const approvedOrders = safeOrders.filter(
    (o) => o.status === "approved"
  ).length;

  const rejectedOrders = safeOrders.filter(
    (o) => o.status === "rejected"
  ).length;

  const revenue = safeOrders
    .filter((o) => o.status === "approved")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
        Loading Dashboard...
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* SIDEBAR */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 p-6">

        <h1 className="text-3xl font-bold text-green-500 mb-10">
          RR Cafe Admin
        </h1>

        <div className="space-y-3">

          <div className="flex items-center gap-3 bg-green-500 p-3 rounded-xl">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          <div className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-xl">
            <ShoppingCart size={20} />
            Orders
          </div>
<Link href="/Admin/Menu" className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-xl">
  <div className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-xl cursor-pointer">
    <Coffee size={20} />
    Menu
  </div>
</Link>

          <div className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-xl">
            <Wallet size={20} />
            Revenue
          </div>

          <div className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-xl">
            <Users size={20} />
            Customers
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Manage Orders ☕</p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              router.push("/Admin/Login");
            }}
            className="bg-red-500 px-5 py-2 rounded-xl"
          >
            Logout
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

          <div className="bg-orange-600 p-4 rounded-2xl">
            Total<br />
            <span className="text-2xl font-bold">{totalOrders}</span>
          </div>

          <div className="bg-yellow-600 p-4 rounded-2xl">
            Pending<br />
            <span className="text-2xl font-bold">{pendingOrders}</span>
          </div>

          <div className="bg-green-600 p-4 rounded-2xl">
            Approved<br />
            <span className="text-2xl font-bold">{approvedOrders}</span>
          </div>

          <div className="bg-red-600 p-4 rounded-2xl">
            Rejected<br />
            <span className="text-2xl font-bold">{rejectedOrders}</span>
          </div>

          <div className="bg-blue-600 p-4 rounded-2xl">
            Revenue<br />
            <span className="text-xl font-bold">Rs {revenue}</span>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

          <h2 className="text-2xl font-bold mb-4">
            Orders List
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items </th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {safeOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-800">

                    <td className="py-3">
                      {order.customerName}
                    </td>

                    <td>{order.phone}</td>
                    <td>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.title} --
                             Qty: {item.quantity}
                          </li>
                        ))}
                        
                      </ul>
                      
                    </td>
                   
                   
                    <td>Rs {order.total}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="space-x-2">

                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveOrder(order._id)}
                            className="bg-green-500 px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectOrder(order._id)}
                            className="bg-red-500 px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === "approved" && (
                        <span className="text-green-400">Approved ✔</span>
                      )}

                      {order.status === "rejected" && (
                        <span className="text-red-400">Rejected ✖</span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}