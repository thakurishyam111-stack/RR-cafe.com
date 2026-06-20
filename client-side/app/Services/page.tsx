"use client";

import Footer from "@/components/Footer";
import React from "react";

export default function HomePage() {
  return (
    <main className="bg-gray-50">

      {/* Hero Section */}
      <section
        className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93')",
        }}
      >
        <div className="bg-black/60 w-full h-full flex items-center justify-center">
          <div className="text-center text-white px-5">
            <h1 className="text-5xl md:text-7xl font-bold mb-5">
              Welcome to Deurali Cafe
            </h1>
            <p className="text-lg md:text-2xl mb-8">
              Fresh Coffee • Delicious Food • Amazing Experience
            </p>

            <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold">
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24"
            alt="Cafe"
            className="rounded-xl shadow-xl"
          />

          <div>
            <h2 className="text-4xl font-bold mb-5 text-gray-950">About Deurali Cafe</h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              RR Cafe is a perfect destination for coffee lovers, food
              enthusiasts, students, freelancers and families. We serve premium
              coffee, delicious meals and provide a cozy environment for work,
              meetings and relaxation.
            </p>

            <div className="mt-6 flex gap-4 flex-wrap">
              <span className="bg-orange-500 px-4 py-2 rounded-full">
                Premium Coffee
              </span>

              <span className="bg-orange-500 px-4 py-2 rounded-full">
                Free WiFi
              </span>

              <span className="bg-orange-500 px-4 py-2 rounded-full">
                Family Friendly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-500 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl mb-4 text-gray-600">☕ Premium Coffee</h3>
              <p className="text-gray-600">
                Freshly brewed coffee made from selected premium beans.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl text-gray-700 mb-4">🍔 Delicious Food</h3>
              <p className="text-gray-600">
                Pizza, Burger, Sandwich, Momo and more delicious dishes.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl text-gray-700 mb-4">🚚 Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable food delivery service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-gray-400">
        <div className="max-w-6xl mx-auto text-gray-900 px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Facilities
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">

            <div className="bg-white p-6 rounded-xl shadow ">
              📶 Free WiFi
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              🚗 Parking Area
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              🔌 Charging Station
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              ❄️ Air Conditioned
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              🎮 Indoor Games
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              💻 Work Friendly
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              👨‍👩‍👧 Family Friendly
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              📸 Photo Corner
            </div>

          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-gray-200">
        <div className="max-w-6xl mx-auto text-gray-900 px-6">

          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Events & Activities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="shadow-lg p-8 rounded-xl">
              <h3 className="text-2xl mb-4">🎵 Live Music Night</h3>
              <p>Enjoy live music every Friday evening.</p>
            </div>

            <div className="shadow-lg p-8 rounded-xl">
              <h3 className="text-2xl mb-4">🎂 Birthday Celebration</h3>
              <p>Special decoration and offers for birthdays.</p>
            </div>

            <div className="shadow-lg p-8 rounded-xl">
              <h3 className="text-2xl mb-4">☕ Coffee Workshop</h3>
              <p>Learn coffee brewing techniques from experts.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-500 text-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <h2 className="text-5xl font-bold">10K+</h2>
              <p>Happy Customers</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold">50+</h2>
              <p>Menu Items</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold">15+</h2>
              <p>Professional Staff</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold">5+</h2>
              <p>Years Experience</p>
            </div>

          </div>
        </div>
      </section>

     
     
      <Footer/>
      
    </main>
  );
}