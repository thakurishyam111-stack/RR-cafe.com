"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Star, Clock3 } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const specials = [
  {
  "name": "Chicken Cheese Burger Combo",
  "price": 850,
  "category": "Burger",
  "description": "Juicy chicken burger with french fries and cold drink.",
  "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  "time": "27 min left",
  "tag": "Chef's Special"
},
  {
  "name": "Cold Coffee Special",
  "price": 450,
  "category": "Coffee",
  "description": "Creamy cold coffee topped with chocolate syrup and ice cream.",
  "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
  "time": "45 min left",
  "tag": "Customer Favorite"
},
  {
  "name": "BBQ Pizza Delight",
  "price": 1200,
  "category": "Pizza",
  "description": "Loaded BBQ chicken pizza with extra cheese and fresh toppings.",
  "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "time": "30 min  left",
  "tag": "Chef's Special"
}
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white text-slate-900">

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-black px-8 py-14 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20 absolute inset-0 bg-black/60">
            <img
              src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg"
              alt="Cafe"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">
                <Flame size={16} />
                Today&apos;s Hot Specials
              </div>

              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Fresh flavors made <br />
                specially for today
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Enjoy handcrafted coffee, delicious meals, and refreshing cafe
                favorites prepared with premium ingredients and cozy vibes.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/Order"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  Order Now
                </Link>

                <Link
                  href="/Menu"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  Explore Menu
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-3xl font-bold">50+</p>
                <p className="mt-2 text-sm text-slate-300">Cafe Specials</p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-3xl font-bold">4.9★</p>
                <p className="mt-2 text-sm text-slate-300">Customer Rating</p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-3xl font-bold">100%</p>
                <p className="mt-2 text-sm text-slate-300">Fresh Ingredients</p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-3xl font-bold">Daily</p>
                <p className="mt-2 text-sm text-slate-300">New Offers</p>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIAL ITEMS */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                Chef Recommendations
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Today&apos;s Special Menu
              </h2>
            </div>

            <Link
              href="/Menu"
              className="hidden rounded-full border border-slate-500 px-5 py-2 text-sm font-medium transition hover:bg-slate-950 hover:text-gray-200 sm:block"
            >
              View Full Menu
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {specials.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    {item.tag}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          4.9
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock3 size={15} />
                          {item.time}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-100 px-4 py-2 text-lg font-bold text-orange-700">
                      {item.price}
                    </div>
                  </div>

                  <p className="mt-5 leading-7 p-5 text-slate-600">
                    {item.description}
                  </p>

                  <Link
                    href="/Order"
                    className="rounded-full border border-gray-500 px-7 py-3 text-sm font-semibold text-gray-600 transition hover:bg-green-600 hover:text-gray-950"
                  >
                    Order now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* OFFER SECTION */}
        <section className="mt-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-amber-500 p-10 text-white shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                Limited Time Offer
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Get 20% OFF on Coffee Combos
              </h2>

              <p className="mt-4 text-lg leading-8 text-orange-50">
                Pair your favorite coffee with sandwiches, toast, or desserts
                and enjoy exclusive cafe discounts today.
              </p>
            </div>

            <Link
              href="/Order"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-orange-600 transition hover:scale-105"
            >
              Claim Offer
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}
