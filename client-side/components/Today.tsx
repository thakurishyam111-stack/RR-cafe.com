"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Star, Clock3, Heart } from "lucide-react";

import Footer from "@/components/Footer";

const specials = [
  {
    name: "Chicken Cheese Burger Combo",
    price: "₹850",
    category: "Burger",
    description: "Juicy chicken burger with crispy fries and a chilled drink.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    time: "27 min left",
    tag: "Chef's Special",
  },
  {
    name: "Cold Coffee Special",
    price: "₹450",
    category: "Coffee",
    description:
      "Creamy cold brew topped with chocolate syrup and scoop of ice cream.",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    time: "45 min left",
    tag: "Customer Favorite",
  },
  {
    name: "BBQ Pizza Delight",
    price: "₹1200",
    category: "Pizza",
    description:
      "Loaded BBQ chicken pizza with extra cheese and fresh garden toppings.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    time: "30 min left",
    tag: "Hot Pick",
  },
];

const categories = ["All", "Coffee", "Burger", "Pizza"];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white text-slate-900">
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=format&fit=crop&w=1400&q=80"
              alt="Cafe ambience"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-orange-900/80" />

          <div className="relative z-10 grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100 backdrop-blur-sm">
                <Flame size={16} />
                Today&apos;s Special Picks
              </div>

              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Discover today&apos;s hottest cafe flavors
              </h1>

              <p className="mt-6 text-lg leading-8 text-orange-100/90">
                Curated just for you: premium coffee, savory bites, and sweet
                treats that celebrate today&rsquo;s fresh ingredients.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/Order"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-300"
                >
                  Order today
                </Link>
                <Link
                  href="/Menu"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15"
                >
                  Explore full menu
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-200">
                  Freshly roasted
                </p>
                <p className="mt-4 text-3xl font-semibold text-white">
                  Roast on demand
                </p>
                <p className="mt-3 text-sm leading-6 text-orange-100/90">
                  Every cup is brewed from beans roasted to order for bold
                  taste.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-200">
                  Seasonal savings
                </p>
                <p className="mt-4 text-3xl font-semibold text-white">
                  Flavor combos
                </p>
                <p className="mt-3 text-sm leading-6 text-orange-100/90">
                  Enjoy handpicked specials created for today&rsquo;s cafe
                  cravings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2.5rem] border border-orange-200/40 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Today&rsquo;s Specials
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Choose your flavor mood
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specials.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-orange-200/30"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                  
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
                    {item.tag}
                  </div>
                  <div className="absolute right-5 top-5 rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                    {item.category}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="rounded-full bg-orange-100 px-4 py-2 text-lg font-bold text-orange-700">
                      {item.price}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] bg-slate-900/90 p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-300" />
                      4.9
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-amber-300" />
                      {item.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href="/Order"
                      className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-300"
                    >
                      Order now
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white transition hover:bg-slate-800"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-gradient-to-r from-orange-500 to-amber-400 p-10 text-slate-950 shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-950/70">
                Why today tastes better
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Made fresh, served warm, and shared with care
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-950/90">
                Each special is selected from today&rsquo;s finest ingredients,
                roasted and prepared by our chefs to deliver the café experience
                you crave.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white/90 p-6 text-slate-950 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                  Fresh menu
                </p>
                <p className="mt-3 text-lg font-semibold">New every day</p>
                <p className="mt-2 text-sm leading-6 text-slate-700/90">
                  We change our specials to match seasonal flavors and chef
                  favorites.
                </p>
              </div>
              <div className="rounded-[1.75rem] bg-white/90 p-6 text-slate-950 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                  Comfort food
                </p>
                <p className="mt-3 text-lg font-semibold">
                  Bold, cozy, memorable
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700/90">
                  Everything is designed to feel indulgent while staying warm
                  and approachable.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
