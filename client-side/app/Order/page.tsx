"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function OrderPage() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [number, setNumber] = useState("");
  const [billNo, setBillNo] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Fetch Menu
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/menus`);

        const items = data?.menus || [];

        setMenus(items);

        const cartItems = items.map((item) => ({
          ...item,
          quantity: 0,
        }));

        setCart(cartItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Categories
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(menus.map((item) => item.category).filter(Boolean)),
    );

    return ["All", ...unique];
  }, [menus]);

  // Filter
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return cart;

    return cart.filter((item) => item.category === selectedCategory);
  }, [cart, selectedCategory]);

  // Update Quantity
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id || item.id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity + delta, 0),
            }
          : item,
      ),
    );
  };

  // Remove Item
  const removeItem = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id || item.id === id
          ? {
              ...item,
              quantity: 0,
            }
          : item,
      ),
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        quantity: 0,
      })),
    );
  };

  // Total
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  // Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^(97|98)\d{8}$/;

    if (!phoneRegex.test(phone)) {
      alert("Invalid phone number. ");
      return;
    }
    const selectedItems = cart.filter((item) => item.quantity > 0);

    if (selectedItems.length === 0) {
      alert("Please add items first");
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/orders/create`, {
        customerName: name,
        phone: phone,
        tableNumber: number,
        items: selectedItems,
        total: total,
      });

      console.log(data);

      if (data.success) {
        setSubmitted(true);

        // clearCart();
        // setName("");
        // setPhone("");
        setBillNo(data.order.billNo);
      }
    } catch (error) {
      console.log("ORDER ERROR:", error);

      alert("Order failed");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold animate-pulse">Loading Menu...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-400">
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black">
            🍽 Cafe Order System
          </h1>

          <p className="text-black mt-3">Order your favorite delicious foods</p>
        </div>

        {/* Categories */}
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full transition text-black font-semibold ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white"
                  : "bg-white border hover:bg-gray-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.5fr_0.7fr] gap-8">
          {/* LEFT */}
          <div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                >
                  {/* Image */}
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                  />

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h2>

                      <span className="font-bold text-green-600">
                        Rs .{item.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 text-l mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Category */}
                    <div className="mt-4">
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-l text-gray-700">
                        {item.category}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center text-gray-800 justify-between mt-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id || item.id, -1)
                          }
                          className="w-10 h-10 rounded-full bg-green-400 hover:bg-slate-300 text-xl"
                        >
                          −
                        </button>

                        <span className="font-bold text-lg w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item._id || item.id, 1)}
                          className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xl"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateQuantity(item._id || item.id, 1)}
                        className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ORDER SECTION */}
          <aside className="bg-gradient-to-b bg-gray-700   text-white rounded-[2rem] p-6 h-fit  shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl text-center font-bold">
                  🛒 Your Order
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Review your selected items
                </p>
              </div>

              {cart.some((item) => item.quantity > 0) && (
                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Items */}
            <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {cart.filter((item) => item.quantity > 0).length > 0 ? (
                cart
                  .filter((item) => item.quantity > 0)
                  .map((item) => (
                    <div
                      key={item._id || item.id}
                      className="bg-slate-800 rounded-3xl p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{item.title}</h3>

                            <button
                              onClick={() => removeItem(item._id || item.id)}
                              className="text-red-400 hover:text-red-500 text-sm"
                            >
                              ✕
                            </button>
                          </div>

                          <p className="text-slate-400 text-sm">
                            Rs {item.price}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id || item.id, -1)
                                }
                                className="w-8 h-8 rounded-full bg-slate-700"
                              >
                                −
                              </button>

                              <span className="font-bold">{item.quantity}</span>

                              <button
                                onClick={() =>
                                  updateQuantity(item._id || item.id, 1)
                                }
                                className="w-8 h-8 rounded-full bg-amber-500"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-amber-400">
                              Rs {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-slate-800 rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-3"></div>

                  <h3 className="text-xl font-bold">Cart Empty</h3>

                  <p className="text-slate-400 mt-2">
                    Add some delicious foods
                  </p>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-6 bg-white/10 rounded-3xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-m text-white">
                    Total Amount
                  </p>

                  <h2 className="text-4xl font-bold text-amber-400 mt-1">
                    Rs .{total}
                  </h2>
                </div>

                <div className="text-right text-xl  text-white">
                  <p>{cart.filter((item) => item.quantity > 0).length} Items</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"
              />
              <input
                type="number"
                pattern="^(97|98)[0-9]{8}$"
                placeholder="Table Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"
              />

              <button
                type="submit"
                className="w-full  bg-green-600 py-4 rounded-2xl font-bold text-lg"
              >
                Order
              </button>
            </form>
          </aside>
        </div>
      </main>

      {/* SUCCESS POPUP */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative">
            <button
              onClick={() => {
                setSubmitted(false);

                clearCart();

                setName("");
                setPhone("");
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-100 hover:bg-red-500 hover:text-white transition text-xl font-bold text-red-500"
            >
              ✕
            </button>
            {/* Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-5xl">✅</span>
            </div>

            {/* Text */}
            <h2 className="text-3xl font-bold text-slate-900 mt-5">
              Order Successful!
            </h2>

            <p className="text-slate-600 mt-3">
              Thank you <span className="font-bold text-gray-800">{name}</span>{" "}
              🎉
            </p>

            <p className="text-slate-500 mt-2 text-sm">
              Your delicious order is being prepared.
            </p>

            {/* Summary */}
            <div className="bg-slate-100 rounded-2xl p-4 mt-5 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Phone</span>

                <span className="font-semibold text-black">{phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-green-500">Total</span>

                <span className="font-bold text-amber-600">Rs .{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Table Number</span>

                <span className="font-bold text-green-600">{number}</span>
              </div>
              
              <span className="text-black p-5  text-l text-center text-bold text-green-950 m-4">remember this bill no for Billing process</span>
              <div className="flex justify-between">
               
                
                <span className="text-black">Bill Number</span>

                <span className="font-bold text-green-600">{billNo}</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                setSubmitted(false);

                clearCart();

                setName("");
                setPhone("");
                setNumber("");
              }}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
