"use client";

import Link from "next/link";
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";

type MapType = "roadmap" | "satellite";

type LocationItem = {
  id: number;
  title: string;
  category: string;
  district: string;
  description: string;
  lat: number;
  lng: number;
  tourUrl?: string;
};

const locations: LocationItem[] = [
  {
    id: 1,
    title: "Ibrahim Palace",
    category: "Historical",
    district: "Hofuf",
    description: "One of Al Ahsa’s iconic heritage sites.",
    lat: 25.3833,
    lng: 49.5861,
    tourUrl: "#",
  },
];

const roadmapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#050505" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#050505" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8c8c8c" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#111111" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#090909" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6f6f6f" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#020202" }],
    },
  ],
};

const satelliteOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [],
};

export default function MapPage() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const motionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [mapType, setMapType] = useState<MapType>("roadmap");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocationId, setSelectedLocationId] = useState(1);
  const [zoom, setZoom] = useState(13);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [animateRightPanel, setAnimateRightPanel] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const filteredLocations = useMemo(() => {
    if (selectedCategory === "All") return locations;
    return locations.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const selectedLocation =
    filteredLocations.find((item) => item.id === selectedLocationId) ||
    filteredLocations[0] ||
    locations[0];

  const isSatellite = mapType === "satellite";

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setOptions(
      isSatellite
        ? {
            ...satelliteOptions,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
          }
        : {
            ...roadmapOptions,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          }
    );
  }, [isSatellite]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    if (motionTimeoutRef.current) {
      clearTimeout(motionTimeoutRef.current);
    }

    mapRef.current.panTo({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });

    mapRef.current.setZoom(12);

    motionTimeoutRef.current = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.panTo({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        });
        mapRef.current.setZoom(14);
      }
    }, 280);

    setZoom(14);
    setAnimateRightPanel(false);

    const panelTimer = setTimeout(() => {
      setAnimateRightPanel(true);
    }, 40);

    return () => {
      clearTimeout(panelTimer);
    };
  }, [selectedLocation]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    return () => {
      if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <GoogleMap
        zoom={zoom}
        center={{
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        }}
        mapContainerClassName="h-full w-full"
        onLoad={(map) => {
          mapRef.current = map;
          map.setOptions({
            ...roadmapOptions,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          });
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
      >
        {filteredLocations.map((location) => {
          const isSelected = location.id === selectedLocation.id;

          return (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelectedLocationId(location.id);
                setRightPanelOpen(true);
              }}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stop-color="#ff3b3b" stop-opacity="${
                            isSelected ? "1" : "0.62"
                          }"/>
                          <stop offset="58%" stop-color="#ff3b3b" stop-opacity="${
                            isSelected ? "0.38" : "0.17"
                          }"/>
                          <stop offset="100%" stop-color="#ff3b3b" stop-opacity="0"/>
                        </radialGradient>
                        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stop-color="#ff5d5d" stop-opacity="1"/>
                          <stop offset="100%" stop-color="#ff1f1f" stop-opacity="${
                            isSelected ? "0.36" : "0.16"
                          }"/>
                        </radialGradient>
                      </defs>

                      <circle cx="48" cy="48" r="${
                        isSelected ? "32" : "24"
                      }" fill="url(#outerGlow)" />
                      <circle cx="48" cy="48" r="${
                        isSelected ? "11" : "8"
                      }" fill="url(#innerGlow)" />
                      <circle cx="48" cy="48" r="${
                        isSelected ? "5.4" : "4.5"
                      }" fill="#ffffff" />
                      <circle cx="48" cy="48" r="${
                        isSelected ? "15" : "11"
                      }" fill="none" stroke="#ff3b3b" stroke-opacity="${
                            isSelected ? "0.56" : "0.24"
                          }" stroke-width="1.3" />
                    </svg>
                  `),
                scaledSize: new window.google.maps.Size(
                  isSelected ? 96 : 72,
                  isSelected ? 96 : 72
                ),
              }}
            />
          );
        })}
      </GoogleMap>

      {!isSatellite && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_58%,rgba(0,0,0,0.24)_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:96px_96px]" />
        </>
      )}

      <div className="absolute left-1/2 top-6 z-20 w-[94%] max-w-6xl -translate-x-1/2">
        <div
          className={`flex items-center gap-3 rounded-full px-4 py-3 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-all duration-300 ${
            isSatellite
              ? "border border-black/10 bg-white/80 text-black"
              : "border border-white/10 bg-white/[0.04] text-white"
          }`}
        >
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isSatellite
                ? "bg-black text-white hover:bg-black/90"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            Home
          </Link>

          <button
            onClick={() =>
              setMapType((prev) =>
                prev === "roadmap" ? "satellite" : "roadmap"
              )
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isSatellite
                ? "bg-black/10 text-black hover:bg-black/15"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {isSatellite ? "Map" : "Satellite"}
          </button>

          <input
            placeholder="Search..."
            className={`flex-1 bg-transparent px-4 text-sm outline-none ${
              isSatellite
                ? "text-black placeholder:text-black/40"
                : "text-white placeholder:text-white/30"
            }`}
          />

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedCategory(next);

                const firstMatch =
                  next === "All"
                    ? locations[0]
                    : locations.find((item) => item.category === next) ||
                      locations[0];

                setSelectedLocationId(firstMatch.id);
                setRightPanelOpen(true);
              }}
              className={`appearance-none rounded-full px-4 py-2 pr-10 text-sm font-medium outline-none transition-all duration-300 ${
                isSatellite
                  ? "border border-black/10 bg-black text-white"
                  : "border border-white/10 bg-[#111111] text-white"
              }`}
            >
              <option className="bg-[#111111] text-white">All</option>
              <option className="bg-[#111111] text-white">Historical</option>
              <option className="bg-[#111111] text-white">Tourism</option>
            </select>

            <span
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs ${
                isSatellite ? "text-white/80" : "text-white/70"
              }`}
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 top-24 z-20 w-[300px]">
        <div
          className={`flex h-full flex-col rounded-[28px] p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ${
            isSatellite
              ? "border border-black/10 bg-white/78 text-black"
              : "border border-white/10 bg-white/[0.04] text-white"
          }`}
          style={{
            boxShadow: isSatellite
              ? "0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)"
              : "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Locations</h2>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                isSatellite
                  ? "bg-black/5 text-black/55"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {filteredLocations.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {filteredLocations.map((location) => {
              const active = location.id === selectedLocation.id;

              return (
                <button
                  key={location.id}
                  onClick={() => {
                    setSelectedLocationId(location.id);
                    setRightPanelOpen(true);
                  }}
                  className={`group relative w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                    isSatellite
                      ? active
                        ? "border-black/12 bg-black/[0.06] text-black shadow-[0_0_30px_rgba(0,0,0,0.06)]"
                        : "border-black/8 bg-white/30 text-black hover:bg-black/[0.04]"
                      : active
                      ? "border-white/18 bg-white/[0.09] text-white shadow-[0_0_40px_rgba(255,255,255,0.04)]"
                      : "border-white/10 bg-white/[0.045] text-white hover:bg-white/[0.07]"
                  } hover:-translate-y-[1px]`}
                  style={{
                    boxShadow:
                      active && !isSatellite
                        ? "0 0 0 1px rgba(255,255,255,0.04), 0 12px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)"
                        : undefined,
                  }}
                >
                  {!isSatellite && active && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent,transparent)]" />
                  )}

                  <p className="relative text-sm font-medium">{location.title}</p>
                  <p
                    className={`relative mt-1 text-xs ${
                      isSatellite ? "text-black/45" : "text-white/50"
                    }`}
                  >
                    {location.category} - {location.district}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {rightPanelOpen && (
        <div className="absolute bottom-6 right-6 top-24 z-20 hidden w-[420px] xl:block">
          <div
            className={`flex h-full flex-col rounded-[28px] p-5 backdrop-blur-2xl transition-all duration-500 ${
              isSatellite
                ? "border border-black/10 bg-white/78 text-black"
                : "border border-white/10 bg-white/[0.04] text-white"
            } ${animateRightPanel ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
            style={{
              boxShadow: isSatellite
                ? "0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)"
                : "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-4xl font-semibold leading-none tracking-[-0.04em]">
                  {selectedLocation.title}
                </h2>
                <p
                  className={`mt-3 text-base ${
                    isSatellite ? "text-black/55" : "text-white/55"
                  }`}
                >
                  {selectedLocation.category} - {selectedLocation.district}
                </p>
              </div>

              <button
                onClick={() => setRightPanelOpen(false)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  isSatellite
                    ? "bg-black/6 text-black hover:bg-black/10"
                    : "bg-white/10 text-white/85 hover:bg-white/15"
                }`}
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-[1px] ${
                  isSatellite
                    ? "border-black/10 bg-black/[0.04]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
                style={{
                  boxShadow: isSatellite
                    ? "inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <h3 className="text-sm font-semibold">Description</h3>
                <p
                  className={`mt-4 text-sm leading-8 ${
                    isSatellite ? "text-black/70" : "text-white/72"
                  }`}
                >
                  {selectedLocation.description}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-[1px] ${
                  isSatellite
                    ? "border-black/10 bg-black/[0.04]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
                style={{
                  boxShadow: isSatellite
                    ? "inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <h3 className="text-sm font-semibold">Location Details</h3>
                <div
                  className={`mt-4 space-y-3 text-sm ${
                    isSatellite ? "text-black/70" : "text-white/72"
                  }`}
                >
                  <p>District: {selectedLocation.district}</p>
                  <p>
                    Coordinates: {selectedLocation.lat.toFixed(3)},{" "}
                    {selectedLocation.lng.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <a
                href={selectedLocation.tourUrl || "#"}
                className={`block w-full rounded-full py-4 text-center text-lg font-semibold transition-all duration-300 hover:scale-[1.01] ${
                  isSatellite
                    ? "bg-black text-white hover:bg-black/92"
                    : "bg-white text-black hover:bg-white/92"
                }`}
              >
                Explore Tour
              </a>
            </div>
          </div>
        </div>
      )}

      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className={`absolute bottom-40 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-semibold backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] ${
            isSatellite
              ? "border-black/10 bg-white/80 text-black hover:bg-white"
              : "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.15]"
          }`}
          aria-label="Open info panel"
          title="Open info panel"
        >
          ≡
        </button>
      )}

      <div className="absolute bottom-10 right-6 z-20 flex flex-col gap-3">
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 1, 20))}
          className={`h-11 w-11 rounded-full border backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] ${
            isSatellite
              ? "border-black/10 bg-white/80 text-black hover:bg-white"
              : "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.15]"
          }`}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 1, 3))}
          className={`h-11 w-11 rounded-full border backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] ${
            isSatellite
              ? "border-black/10 bg-white/80 text-black hover:bg-white"
              : "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.15]"
          }`}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}