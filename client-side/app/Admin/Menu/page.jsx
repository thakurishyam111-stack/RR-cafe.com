"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

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
      (m.title || "").toLowerCase().includes(search.toLowerCase())
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
        await axios.put(
          `${API_BASE_URL}/api/menus/update/${editId}`,
          payload
        );
      } else {
        // ✅ FIXED ROUTE (your backend uses /add)
        await axios.post(
          `${API_BASE_URL}/api/menus/add`,
          payload
        );
      }

      setShowModal(false);
      fetchMenus();
    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Save failed! Check backend or API route."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteMenu = async (id) => {
    if (!confirm("Delete this menu?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/menus/delete/${id}`
      );
      fetchMenus();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-600 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl text-center font-bold">🍽 Menu Dashboard</h1>
          <p className="text-gray-400 text-center">Manage cafe menu easily</p>
        </div>

        <button
          onClick={openAdd}
          className="bg-amber-500 px-5 py-3 rounded-xl font-bold hover:bg-amber-600"
        >
          + Add Menu
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400">Total Menus</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400">Active Items</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400">Categories</p>
          <h2 className="text-3xl font-bold">
            {new Set(menus.map((m) => m.category)).size}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-gray-800 outline-none"
      />

      {/* MENU GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition"
          >
            <img
              src={item.image}
              className="h-52 w-full object-cover"
              alt={item.title}
            />

            <div className="p-4">
              <div className="flex justify-between">
                <h2 className="font-bold text-xl">{item.title}</h2>
                <span className="text-green-400 font-bold">
                  Rs {item.price}
                </span>
              </div>

              <p className="text-gray-400 text-sm mt-2">
                {item.description}
              </p>

              <span className="inline-block mt-3 text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                {item.category}
              </span>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 bg-blue-600 py-2 rounded-xl hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMenu(item._id)}
                  className="flex-1 bg-red-600 py-2 rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-xl p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-4">
              {editId ? "Update Menu" : "Add Menu"}
            </h2>

            <div className="grid gap-3">

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="p-3 rounded bg-gray-800"
              />

              <input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="p-3 rounded bg-gray-800"
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="p-3 rounded bg-gray-800"
              />

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                className="p-3 rounded bg-gray-800"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="p-3 rounded bg-gray-800"
              />
            </div>

            <div className="flex gap-3 mt-5">

              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-bold ${
                  loading
                    ? "bg-gray-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}