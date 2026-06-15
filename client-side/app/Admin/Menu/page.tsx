"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // ================= FETCH MENUS =================
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/menus`);
      setMenus(data.menus || []);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ================= FILTER =================
  const filteredMenus = useMemo(() => {
    return menus.filter((m) =>
      (m.title || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [menus, search]);

  const total = menus.length;

  // ================= OPEN ADD =================
  const openAdd = () => {
    setEditId(null);
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      image: "",
    });
    setShowModal(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (menu) => {
    setEditId(menu._id);

    setForm({
      title: menu.title || "",
      price: menu.price?.toString() || "",
      category: menu.category || "",
      description: menu.description || "",
      image: menu.image || "",
    });

    setShowModal(true);
  };

  // ================= SAVE (ADD / UPDATE) =================
  const handleSave = async () => {
    if (!form.title || !form.price) {
      alert("Title and Price required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price), // IMPORTANT FIX
      };

      if (editId) {
        await axios.put(`${API_BASE_URL}/api/menus/update/${editId}`, payload);
      } else {
        // ✅ FIXED ROUTE (your backend uses /add)
        await axios.post(`${API_BASE_URL}/api/menus/add`, payload);
      }

      setShowModal(false);
      fetchMenus();
    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Save failed! Check backend or API route.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteMenu = async (id) => {
    if (!confirm("Delete this menu?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/menus/delete/${id}`);
      fetchMenus();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🍽 Menu Management</h1>
            <p className="text-gray-400">
              Add, edit, or manage cafe menu items
            </p>
          </div>

          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-500/30"
          >
            <Plus size={20} />
            Add Menu
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-6 rounded-xl hover:border-orange-500/40 transition-all duration-300">
            <p className="text-orange-300 text-sm font-medium">Total Items</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all duration-300">
            <p className="text-blue-300 text-sm font-medium">Categories</p>
            <h2 className="text-3xl font-bold mt-2">
              {new Set(menus.map((m) => m.category)).size}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all duration-300">
            <p className="text-green-300 text-sm font-medium">Active Items</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* MENU GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No menu items found</p>
            </div>
          ) : (
            filteredMenus.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
              >
                <div className="h-48 w-full overflow-hidden bg-gray-800">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                    alt={item.title}
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="font-bold text-lg flex-1">{item.title}</h2>
                    <span className="text-green-400 font-bold whitespace-nowrap text-lg">
                      Rs {item.price}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <span className="inline-block mb-4 text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                    {item.category}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg transition-colors border border-blue-500/30"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteMenu(item._id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition-colors border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-xl p-6 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">
                {editId ? "Update Menu Item" : "Add New Menu Item"}
              </h2>

              <div className="grid gap-4">
                <input
                  placeholder="Item Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Price (Rs)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all duration-200 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30"
                  }`}
                >
                  {loading ? "Saving..." : "Save Item"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
