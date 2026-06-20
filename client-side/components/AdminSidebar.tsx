"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Wallet,
  Users,
  LogOut,
  Menu,
  X,
  Flame,
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/Admin/Dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Customers",
      href: "/Admin/Customer",
      icon: Users,
    },
    {
      label: "Orders",
      href: "/Admin/Order",
      icon: ShoppingCart,
    },
    {
      label: "Menu",
      href: "/Admin/Menu",
      icon: Coffee,
    },

    {
      label: "Revenue",
      href: "/Admin/Revenue",
      icon: Wallet,
    },
    {
      label: "Today-special",
      href: "/Admin/Today-special",
      icon: Flame,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/Admin/Login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-500 p-2 rounded-lg text-white hover:bg-green-600 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 p-6 transition-transform duration-300 ease-in-out z-50 overflow-y-auto md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
            Deurali Cafe
          </h1>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
