"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cafeLocation = [27.7172, 85.3240]; // Kathmandu example

const cafeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [40, 40],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
});

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  return (
    <section className="py-16 bg-gray-500 w-200  rounded-4xl mt-10 overflow-hidden shadow-xl  ">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Visit RR Cafe
        </h2>

        <div className="rounded-xl overflow-hidden shadow-xl">
          <MapContainer
            center={cafeLocation}
            zoom={14}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Cafe Marker */}
            <Marker position={cafeLocation} icon={cafeIcon}>
              <Popup>
                <b>RR Cafe</b>
                <br />
                Welcome to our cafe ☕
              </Popup>
            </Marker>

            {/* User Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>Your Current Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}