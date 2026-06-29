"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { MapPin, Navigation, Coffee, Phone } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cafeLocation: [number, number] = [27.7172, 85.324];

const cafeIcon = new L.Icon({
  iconUrl: "/cafe-logo.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: "https://png.pngtree.com/template/20191203/ourmid/pngtree-coffee-logo-design-vector-image_337940.jpg",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

export default function CafeMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {}
    );
  }, []);

  return (
    /* 1. Replaced hard margins with padding and responsive container bounds */
    <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 lg:py-20 text-slate-100 shadow-2xl">
      {/* Absolute Backdrop Gradient Layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_40%)] pointer-events-none select-none" />
      
      <div className="relative mx-auto max-w-7xl">
        
        {/* Header Branding Container */}
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-flex rounded-full bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            Find us on the map
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Visit Deurali Cafe
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Explore our cafe location with a real map experience, custom marker,
            and easy directions to arrive fast.
          </p>
        </div>

        {/* Core Layout Grid System */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          
          {/* Info Sidebar Section */}
          <div className="flex flex-col justify-between rounded-2xl sm:rounded-[2rem] border border-slate-800/60 bg-slate-950/40 backdrop-blur-md p-6 sm:p-8 shadow-xl lg:col-span-4">
            <div>
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner">
                  <Coffee size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Cafe Location
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    Deurali Cafe
                  </h3>
                </div>
              </div>

              {/* Utility Contact Info Blocks */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-4 rounded-2xl bg-slate-900/60 border border-slate-800/40 p-4 transition hover:border-slate-700/60">
                  <MapPin className="mt-0.5 h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Location</p>
                    <p className="text-sm text-slate-300 mt-0.5">Kathmandu, Nepal</p>
                  </div>
                </div>
                
                <div className="flex gap-4 rounded-2xl bg-slate-900/60 border border-slate-800/40 p-4 transition hover:border-slate-700/60">
                  <Navigation className="mt-0.5 h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Navigation</p>
                    <p className="text-sm text-slate-300 mt-0.5">
                      Tap the marker for details.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 rounded-2xl bg-slate-900/60 border border-slate-800/40 p-4 transition hover:border-slate-700/60">
                  <Phone className="mt-0.5 h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Contact</p>
                    <p className="text-sm text-slate-300 mt-0.5">+977 9845784548</p>
                  </div>
                </div>
              </div>
            </div>

            {/* External Navigation Button Anchor */}
            <a
              href={`https://www.google.com/maps?q=${cafeLocation[0]},${cafeLocation[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-amber-500 text-sm font-semibold text-slate-950 transition-all hover:bg-amber-400 active:scale-[0.99]"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Leaflet Map Interactive Dynamic Container */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-800/60 shadow-xl min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] flex">
            <div className="w-full h-full min-h-[inherit] relative isolate">
              <MapContainer
                center={cafeLocation}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full absolute inset-0"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={cafeLocation} icon={cafeIcon}>
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <p className="font-bold text-sm">Deurali Cafe ☕</p>
                      <p className="text-xs text-slate-600">Kathmandu, Nepal</p>
                      <p className="text-xs font-medium text-amber-600 mt-1">Open 7:00 AM - 11:00 PM</p>
                    </div>
                  </Popup>
                  <Tooltip direction="top" offset={[0, -25]} opacity={0.95}>
                    Deurali Cafe - Click for details
                  </Tooltip>
                </Marker>

                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="p-1 text-slate-900">
                        <p className="font-bold text-sm">Your Location</p>
                        <p className="text-xs text-slate-600">Starting point for directions.</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}