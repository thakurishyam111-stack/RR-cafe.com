"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // AUTH CHECK
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/Admin/Login");
      return;
    }

    fetchOrders();

    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // ======================
  // FETCH ORDERS
  // ======================
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders");
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
  const approveOrder = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
      fetchOrders();
    } catch (err) {
      console.log("Approve Error:", err.message);
    }
  };

  // ======================
  // REJECT ORDER
  // ======================
  const rejectOrder = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
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
  const pendingOrders = safeOrders.filter((o) => o.status === "pending").length;
  const approvedOrders = safeOrders.filter(
    (o) => o.status === "approved",
  ).length;
  const rejectedOrders = safeOrders.filter(
    (o) => o.status === "rejected",
  ).length;
  const revenue = safeOrders
    .filter((o) => o.status === "approved")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back! Here's your order overview ☕
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold mt-2">{totalOrders}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 p-6 rounded-xl hover:border-yellow-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </div>

          {/* Approved Orders */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold mt-2">{approvedOrders}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>

          {/* Rejected Orders */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-6 rounded-xl hover:border-red-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold mt-2">{rejectedOrders}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6 rounded-xl hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold mt-2">Rs {revenue}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {safeOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  safeOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-medium">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{order.phone}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index}>
                              {item.title} (×{item.quantity})
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-gray-400">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-400">
                        Rs {order.total}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : order.status === "approved"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.status === "pending" && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => approveOrder(order._id)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded text-sm transition-colors duration-200 border border-green-500/30"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectOrder(order._id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm transition-colors duration-200 border border-red-500/30"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {order.status === "approved" && (
                          <span className="text-green-400 text-sm">
                            ✓ Approved
                          </span>
                        )}

                        {order.status === "rejected" && (
                          <span className="text-red-400 text-sm">
                            ✕ Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
