"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Navigation, Coffee } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cafeLocation = [27.7172, 85.3240];

const cafeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [42, 42],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
});

export default function CafeMap() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      () => {}
    );
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-300 mt-10 rounded-4xl z-100">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold">
            Visit Royel Cafe
          </h2>
          <p className="text-gray-500 mt-3">
            Fresh coffee, delicious food and a cozy atmosphere.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Info Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <Coffee size={28} />
              <h3 className="text-2xl font-bold">
                RR Cafe
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin />
                <div>
                  <p className="font-semibold">
                    Location
                  </p>
                  <p className="text-gray-600">
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Navigation />
                <div>
                  <p className="font-semibold">
                    Navigation
                  </p>
                  <p className="text-gray-600">
                    Easy directions from your location.
                  </p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps?q=${cafeLocation[0]},${cafeLocation[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl border">
            <MapContainer
              center={cafeLocation}
              zoom={15}
              scrollWheelZoom={true}
              style={{
                height: "600px",
                width: "100%",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={cafeLocation} icon={cafeIcon}>
                <Popup>
                  <strong>RR Cafe ☕</strong>
                  <br />
                  Welcome to our cafe.
                </Popup>
              </Marker>

              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    Your Current Location
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

        </div>
      </div>
    </section>
  );
}