"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Search, Wallet, MapPin } from "lucide-react";
import BillWidget from "@/components/BillWidget";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Today's", href: "/TodaySpecial" },
    { label: "Order", href: "/Order" },
    { label: "Services", href: "/Services" },
    { label: "Menu", href: "/Menu" },
    { label: "About", href: "/#about" },
  ];

  const [notifCount] = useState(3);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname && pathname.startsWith("/Admin")) return null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = drawerOpen || isBillOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, isBillOpen]);

  const handleOpenBill = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setIsBillOpen(true);
    }, 300);
  };

  //search 
  
  return (
    <>
      {/* 1. Header Wrapper */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-amber-50/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo/cafelogo.png"
                alt="Cafe logo"
                className="h-15 w-15 rounded-full object-cover ring-2 ring-amber-500/20"
              />
              <span className="hidden sm:block font-serif text-lg font-bold text-slate-800 tracking-wide italic">
                Mero Deurali Cafe
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive(it.href)
                      ? "bg-amber-100 text-amber-900 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* Search Input Box */}


            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden md:flex max-w-md flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-3.5 h-11 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
            >
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition"
              >
                Go
              </button>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/Notification"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Bell className="h-5 w-5" />
                {notifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notifCount}
                  </span>
                )}
              </Link>

              <Link
                href="/Map"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <MapPin className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={handleOpenBill}
                className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-amber-600 hover:text-white shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                <span>Bill</span>
              </button>

              {/* Mobile Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-md transition touch-manipulation cursor-pointer lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Backdrop Overlay (z-[60] मा राखिएको) */}
      <div
        className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* 3. Slide-out Mobile Sheet / Sidebar (z-[70] मा राखिएको छ जसले गर्दा सधैं अगाडि देखिन्छ) */}
      <aside
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 bg-slate-50">
          <span className="font-serif text-lg font-bold text-slate-900 italic">
            <img
                src="/logo/cafelogo.png"
                alt="Cafe logo"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/20"
              />
            Mero Deurali Cafe
          </span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Nav Actions / Item List */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Search input */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex md:hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 h-11"
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
            />
          </form>

          {/* Links List */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setDrawerOpen(false)}
                className={`text-base font-medium px-4 py-3 rounded-xl transition ${
                  isActive(it.href)
                    ? "bg-amber-50 text-amber-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <hr className="border-slate-100" />

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2.5">
            <Link
              href="/Notification"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition"
            >
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium">Notifications</span>
              {notifCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {notifCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setIsBillOpen(true);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-amber-600 text-white shadow-md hover:bg-amber-700 active:scale-98 transition text-left cursor-pointer"
            >
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-semibold">View My Bill</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Bill Sidebar Widget */}
      <BillWidget isOpen={isBillOpen} onClose={() => setIsBillOpen(false)} />
    </>
  );
}