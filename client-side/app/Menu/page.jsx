"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const Page = () => {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/menus`);
      const items = data?.menus || [];
      setMenus(items);
      setApiError(
        data?.success === false
          ? data?.message || "Failed to load menus."
          : null,
      );
    } catch (error) {
      console.error("Error fetching menus:", error);
      setApiError("Unable to fetch menu items. Please try again later.");
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(menus.map((item) => item.category).filter(Boolean)),
    );
    return ["All", ...unique];
  }, [menus]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menus;
    return menus.filter((item) => item.category === selectedCategory);
  }, [menus, selectedCategory]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold">Loading menu...</p>
      </div>
    );
  }

  // Empty state or API error
  if (!menus.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold">
          {apiError || "No menu items found in database."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 text-white p-6">
      



      <h1 className="text-4xl font-bold text-center mb-10">☕ Cafe Menu</h1>

      {/* Category Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full transition ${
              selectedCategory === cat
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 hover:bg-yellow-500 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item._id || item.id}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            {/* Image */}
            <img
              src={item.image || "/placeholder.png"}
              alt={item.title}
              className="h-56 w-full object-cover"
            />

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <span className="text-yellow-400 font-bold">
                  Rs {item.price}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                  {item.category}
                </span>

                <button
                  onClick={() => router.push("/Order")}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
