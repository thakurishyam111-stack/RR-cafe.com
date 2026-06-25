"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  ShoppingCart,
  Search,
  Wallet,
  MapIcon,
  LocateIcon,
  Map,
  MapPin,
} from "lucide-react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Today\'s", href: "/TodaySpacial" },
    { label: "Order", href: "/Order" },
    { label: "Services", href: "/Services" },
    { label: "Menu", href: "/Menu" },
    { label: "About", href: "/#about" },
  ];

  // small UI state
  const [notifCount, setNotifCount] = useState();
  const [cartCount, setCartCount] = useState();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Hide global navbar on admin routes (admin pages use AdminSidebar)
  if (pathname && pathname.startsWith("/Admin")) return null;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-100 bg-amber-50 backdrop-blur-md border-b shadow-xl rounded-4xl border-slate-200">
        <div className="mx-auto flex items-center justify-between  ">
          <div className="flex justify-between items-start  ">
            <div className=" p-5">
              <img
                src="/logo/cafelogo.png"
                alt="Cafe logo"
                className="h-20 w-20 rounded-full object-cover"
              />
              <i className="text-gray-700 text-lg"> Deurali Cafe</i>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xl">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`text-l px-3 py-2 rounded-md transition ${isActive(it.href) ? "bg-amber-100 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-100 hover:text-sky-600"}`}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-gray-800">
            <form className="hidden md:flex items-center  rounded-full border border-gray-500 bg-gray-100 w-80">
              <Search className="h-10 w-full text-gray-500 " />
              <input
                aria-label="Search"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-700 "
              />
            </form>
              <Link
                href="/Notification"
                className="hidden sm:inline-flex items-center rounded-full gap-5 text-slate-700 hover:bg-slate-100 relative"
              >
                <Bell className="h-5 w-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5 gap-5">
                    {notifCount}
                  </span>
                )}
              </Link>
              <Link
                href="/Map"
                className="hidden sm:inline-flex items-center rounded-full p-2 text-slate-700 hover:bg-slate-100 relative"
              >
                <MapPin />
              </Link>

              <Link
                href="/Bill"
                className="hidden sm:inline-flex items-center p-2 gap-3 text-slate-700 hover:bg-gray-200 rounded-full relative"
              >
                <img
                  src={
                    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/cash-logo-design-template-f2d7e3d4a6bfd90d4a18bfa2ec7db301_screen.jpg?ts=1735191066"
                  }
                  width={40}
                  height={40}
                  alt="cash"
                  className=" rounded-full  "
                />
              </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white p-2 md:hidden shadow-md"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between p-4 border-b bg-gray-200">
          <div>
            <div className="text-lg font-semibold text-gray-800 text-center">
              {" "}
              The Deurali Cafe
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-gray-400"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-red-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2 bg-gray-300">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setDrawerOpen(false)}
              className="block rounded-md px-3 py-2 text-gray-800 hover:bg-slate-50"
            >
              {it.label}
            </Link>
          ))}

          <form className="hidden md:flex items-center gap-2 rounded-full border border-gray-500 bg-gray-100 px-3 py-1">
            <Search className="h-4 w-4 text-gray-500 " />
            <input
              aria-label="Search"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-700"
            />
          </form>

          <div className="mt-4 space-y-2 text-gray-800">
            <Link
              href="/Notification"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center text-bg-800 gap-2 px-3 py-2 rounded-md hover:bg-slate-50 "
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
            <Link
              href="/Bill"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500 text-white"
            >
              <Wallet className="h-4 w-4" />
              Bill
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
