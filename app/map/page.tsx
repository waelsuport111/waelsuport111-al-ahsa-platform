"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type LocationItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  district: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  tour_url?: string;
};

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 25.3839,
  lng: 49.586,
};

const categories = [
  "All",
  "Tourism",
  "Historical",
  "Municipality",
  "Culture",
  "Entertainment",
  "Hospitality",
  "Public Service",
];

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#081225" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#081225" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1b2940" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7b8798" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#030b18" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#0b172b" }],
  },
];

export default function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selected, setSelected] = useState<LocationItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showTour, setShowTour] = useState(false);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/locations", { cache: "no-store" });
        const data = await res.json();

        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Failed to load locations:", error);
        setLocations([]);
      }
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...locations];

    if (activeCategory !== "All") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q)
      );
    }

    return result;
  }, [locations, activeCategory, search]);

  useEffect(() => {
    if (!mapRef.current || filtered.length === 0 || selected) return;

    const bounds = new window.google.maps.LatLngBounds();

    filtered.forEach((loc) => {
      bounds.extend({
        lat: loc.latitude,
        lng: loc.longitude,
      });
    });

    mapRef.current.fitBounds(bounds);

    if (filtered.length === 1) {
      mapRef.current.setZoom(15);
    }
  }, [filtered, selected]);

  useEffect(() => {
    if (!selected || !mapRef.current) return;

    mapRef.current.panTo({
      lat: selected.latitude,
      lng: selected.longitude,
    });
    mapRef.current.setZoom(15);
  }, [selected]);

  const closePanel = () => {
    setSelected(null);
    setShowTour(false);
  };

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom() || 11;
    mapRef.current.setZoom(currentZoom + 1);
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom() || 11;
    mapRef.current.setZoom(currentZoom - 1);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081225] text-white">
        Loading map...
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#081225] text-white">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={11}
        mapTypeId={mapType}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onClick={closePanel}
        options={{
          styles: mapType === "roadmap" ? darkMapStyle : undefined,
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          clickableIcons: false,
        }}
      >
        {filtered.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            onClick={() => {
              setSelected(loc);
              setShowTour(false);
            }}
            icon={
              selected?.id === loc.id
                ? {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }
                : undefined
            }
          />
        ))}
      </GoogleMap>

      <div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-5xl items-center gap-3 rounded-[28px] border border-white/10 bg-[#0d1728]/88 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <Link
            href="/"
            className="shrink-0 rounded-[18px] border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Home
          </Link>

          <div className="flex shrink-0 items-center rounded-[18px] border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setMapType("roadmap")}
              className={`rounded-[14px] px-4 py-2.5 text-sm font-semibold transition ${
                mapType === "roadmap"
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType("satellite")}
              className={`rounded-[14px] px-4 py-2.5 text-sm font-semibold transition ${
                mapType === "satellite"
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              Satellite
            </button>
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[18px] border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <select
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setSelected(null);
              setShowTour(false);
            }}
            className="rounded-[18px] border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0d1728]">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <aside className="absolute left-4 top-24 z-30 h-[calc(100vh-7rem)] w-[320px] overflow-y-auto rounded-[30px] border border-white/10 bg-[#071426]/90 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[28px] font-semibold tracking-tight text-white">
            Locations
          </h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            {filtered.length}
          </span>
        </div>

        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelected(loc);
                  setShowTour(false);
                }}
                className={`w-full rounded-[18px] border p-4 text-left transition ${
                  selected?.id === loc.id
                    ? "border-white/30 bg-white/10 shadow-[0_10px_30px_rgba(255,255,255,0.06)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <h4 className="text-sm font-semibold text-white">{loc.title}</h4>
                <p className="mt-1 text-xs text-white/60">
                  {loc.category} • {loc.district || "Al Ahsa"}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              No locations found.
            </div>
          )}
        </div>
      </aside>

      {selected && (
        <aside className="absolute right-4 top-24 z-30 h-[calc(100vh-7rem)] w-[380px] overflow-y-auto rounded-[30px] border border-white/10 bg-[#071426]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                {selected.title}
              </h2>
              <p className="mt-2 text-sm text-white/60">
                {selected.category} • {selected.district || "Al Ahsa"}
              </p>
            </div>

            <button
              onClick={closePanel}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>

          {selected.image_url && (
            <img
              src={selected.image_url}
              alt={selected.title}
              className="mb-5 h-56 w-full rounded-[24px] object-cover"
            />
          )}

          <div className="space-y-6">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Description
              </h3>
              <p className="text-sm leading-7 text-white/72">
                {selected.description || "No description available yet."}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Location Details
              </h3>
              <p className="text-sm leading-7 text-white/72">
                District: {selected.district || "Not specified"}
              </p>
              <p className="text-sm leading-7 text-white/72">
                Coordinates: {selected.latitude}, {selected.longitude}
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowTour(true)}
                className="w-full rounded-[20px] bg-white py-4 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Explore Tour
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
        <button
          onClick={handleZoomIn}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1728]/88 text-xl font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:bg-white/10"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1728]/88 text-xl font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:bg-white/10"
        >
          −
        </button>
      </div>

      {showTour && selected && (
        <div className="absolute inset-0 z-50 bg-black">
          <div className="absolute left-4 right-4 top-4 z-50 flex items-center justify-between rounded-[20px] border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl">
            <div>
              <h3 className="text-base font-semibold text-white">
                {selected.title}
              </h3>
              <p className="text-xs text-white/60">Immersive Tour View</p>
            </div>

            <button
              onClick={() => setShowTour(false)}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Close Tour
            </button>
          </div>

          {selected.tour_url ? (
            <iframe
              src={selected.tour_url}
              className="h-full w-full"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#081225] px-6 text-center text-white">
              <div>
                <h3 className="text-2xl font-semibold">Tour not available yet</h3>
                <p className="mt-3 text-sm text-white/65">
                  Add a tour URL for this location from the dashboard later.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}