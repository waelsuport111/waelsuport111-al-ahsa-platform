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
  locationDetails?: string;
  contactLabel?: string;
  contactValue?: string;
  tourUrl?: string;
  images?: string[];
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 25.3838,
  lng: 49.5869,
};

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#05080f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a7b5c9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#05080f" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#142033" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#05080f" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#0a1019" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#111826" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0a111c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a1afc3" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#02050a" }],
  },
];

function createPin(selected: boolean): google.maps.Icon {
  const size = selected ? 72 : 58;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 80 80">
      <defs>
        <filter id="shadow" x="-200%" y="-200%" width="400%" height="400%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle cx="40" cy="40" r="${selected ? 26 : 22}" fill="#ff3b30" fill-opacity="0.12"/>
        <circle cx="40" cy="40" r="${selected ? 20 : 17}" fill="#ff3b30" fill-opacity="0.18"/>
        <circle cx="40" cy="40" r="${selected ? 12 : 10}" fill="#ff3b30"/>
        <circle cx="40" cy="40" r="${selected ? 4 : 3.5}" fill="#ffffff"/>
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size / 2),
  };
}

export default function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const navHideTimer = useRef<NodeJS.Timeout | null>(null);

  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tourOpen, setTourOpen] = useState(false);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [panelsHiddenForNav, setPanelsHiddenForNav] = useState(false);

  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch("/api/locations", { cache: "no-store" });
        const data = await res.json();

        const cleaned: LocationItem[] = Array.isArray(data)
          ? data
              .map((item) => ({
                id: Number(item.id),
                title: String(item.title || ""),
                category: String(item.category || ""),
                description: String(item.description || ""),
                district: String(item.district || ""),
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                locationDetails: String(item.locationDetails || ""),
                contactLabel: String(item.contactLabel || ""),
                contactValue: String(item.contactValue || ""),
                tourUrl: String(item.tourUrl || ""),
                images: Array.isArray(item.images) ? item.images : [],
              }))
              .filter(
                (item) =>
                  Number.isFinite(item.id) &&
                  Number.isFinite(item.latitude) &&
                  Number.isFinite(item.longitude) &&
                  item.latitude !== 0 &&
                  item.longitude !== 0
              )
          : [];

        setLocations(cleaned);
      } catch (error) {
        console.error("Failed to load locations:", error);
        setLocations([]);
      }
    }

    loadLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return locations;

    return locations.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q)
      );
    });
  }, [locations, search]);

  const selectedLocation = useMemo(() => {
    return (
      filteredLocations.find((item) => item.id === selectedId) ||
      locations.find((item) => item.id === selectedId) ||
      null
    );
  }, [filteredLocations, locations, selectedId]);

  useEffect(() => {
    if (!mapRef.current || !window.google || filteredLocations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    filteredLocations.forEach((item) => {
      bounds.extend({ lat: item.latitude, lng: item.longitude });
    });

    mapRef.current.fitBounds(bounds, 120);

    if (filteredLocations.length === 1) {
      mapRef.current.setZoom(13);
      mapRef.current.setCenter({
        lat: filteredLocations[0].latitude,
        lng: filteredLocations[0].longitude,
      });
    }
  }, [filteredLocations]);

  useEffect(() => {
    if (filteredLocations.length === 1) {
      setSelectedId(filteredLocations[0].id);
      setRightCollapsed(false);
      return;
    }

    if (search.trim() === "") {
      setSelectedId(null);
      setRightCollapsed(true);
      setTourOpen(false);
    }
  }, [filteredLocations, search]);

  const mapOptions = useMemo<google.maps.MapOptions>(() => {
    return {
      disableDefaultUI: true,
      clickableIcons: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      gestureHandling: "greedy",
      styles: mapType === "roadmap" ? darkMapStyles : undefined,
    };
  }, [mapType]);

  const triggerNavigationHide = () => {
    setPanelsHiddenForNav(true);

    if (navHideTimer.current) {
      clearTimeout(navHideTimer.current);
    }

    navHideTimer.current = setTimeout(() => {
      setPanelsHiddenForNav(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (navHideTimer.current) clearTimeout(navHideTimer.current);
    };
  }, []);

  const showLeftPanel = !leftCollapsed && !panelsHiddenForNav && !tourOpen;
  const showRightPanel =
    !rightCollapsed && !panelsHiddenForNav && !!selectedLocation && !tourOpen;

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="rounded-[28px] border border-white/10 bg-[rgba(8,12,22,0.92)] px-8 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          Failed to load Google Maps
        </div>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="rounded-full border border-white/10 bg-[rgba(8,12,22,0.9)] px-6 py-3 text-sm text-white/70 backdrop-blur-xl">
          Loading map...
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#04070d] text-white">
      <div className="absolute inset-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={initialCenter}
          zoom={11}
          options={mapOptions}
          mapTypeId={mapType}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
          onDragStart={triggerNavigationHide}
          onZoomChanged={triggerNavigationHide}
          onTiltChanged={triggerNavigationHide}
        >
          {filteredLocations.map((item) => {
            const active = item.id === selectedId;

            return (
              <Marker
                key={item.id}
                position={{ lat: item.latitude, lng: item.longitude }}
                onClick={() => {
                  setSelectedId(item.id);
                  setRightCollapsed(false);
                  setPanelsHiddenForNav(false);
                  setTourOpen(false);
                }}
                icon={createPin(active)}
                zIndex={active ? 999 : 1}
              />
            );
          })}
        </GoogleMap>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.34)_0%,rgba(2,4,10,0.10)_28%,rgba(2,4,10,0.16)_55%,rgba(2,4,10,0.38)_100%)]" />

      <div
        className={`absolute top-6 left-1/2 z-20 flex w-[88%] max-w-[980px] -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,24,0.92),rgba(6,9,16,0.96))] px-4 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
          tourOpen ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100"
        }`}
      >
        <Link
          href="/"
          className="rounded-full border border-[#a78743]/45 bg-[linear-gradient(180deg,#f0d58a_0%,#d7b461_38%,#b98c3f_100%)] px-4 py-1.5 text-[11px] font-medium text-[#17120a] shadow-[0_4px_14px_rgba(213,177,93,0.28),inset_0_1px_0_rgba(255,248,220,0.42)] transition hover:brightness-105"
        >
          Home
        </Link>

        <div className="relative flex items-center rounded-full border border-[#a78743]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_6px_20px_rgba(0,0,0,0.2)]">
          <div
            className={`pointer-events-none absolute top-1 bottom-1 rounded-full border border-[#b98b3d]/35 bg-[linear-gradient(180deg,#f2d992_0%,#dbba68_35%,#bf9343_100%)] shadow-[0_8px_22px_rgba(213,177,93,0.24),inset_0_1px_0_rgba(255,248,224,0.55)] transition-all duration-300 ease-out ${
              mapType === "roadmap"
                ? "left-1 w-[60px]"
                : "left-[61px] w-[76px]"
            }`}
          />
          <button
            onClick={() => setMapType("roadmap")}
            className={`relative z-10 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
              mapType === "roadmap" ? "text-[#17120a]" : "text-white/72 hover:text-white"
            }`}
          >
            Map
          </button>

          <button
            onClick={() => setMapType("satellite")}
            className={`relative z-10 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
              mapType === "satellite" ? "text-[#17120a]" : "text-white/72 hover:text-white"
            }`}
          >
            Satellite
          </button>
        </div>

        <div className="hidden h-6 w-px bg-white/10 md:block" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="min-w-0 flex-1 bg-transparent px-2 text-[12px] text-white/85 outline-none placeholder:text-white/25"
        />

        <button className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[11px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          All
        </button>
      </div>

      <aside
        className={`absolute left-6 top-28 bottom-6 z-20 w-[300px] max-w-[calc(100vw-3rem)] transition-all duration-300 ease-out ${
          showLeftPanel
            ? "translate-x-0 opacity-100"
            : "-translate-x-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,18,0.9)_0%,rgba(5,8,14,0.92)_100%)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[13px] font-normal text-white/85">Locations</h2>

            <div className="flex items-center gap-3">
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/8 px-2 text-[10px] text-white/70">
                {filteredLocations.length}
              </span>

              <button
                onClick={() => setLeftCollapsed(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/78 transition duration-300 hover:scale-105 hover:bg-white/10"
                aria-label="Collapse left panel"
              >
                <span className="text-lg leading-none">‹</span>
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {filteredLocations.map((item) => {
              const active = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setRightCollapsed(false);
                    setPanelsHiddenForNav(false);
                    setTourOpen(false);
                  }}
                  className={`w-full rounded-[22px] border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.06))] shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                      : "border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-[0_14px_30px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <h3 className="text-[12px] font-medium text-white">{item.title}</h3>
                  <p className="mt-1 text-[11px] text-white/45">
                    {(item.category || "Historical") + " - " + (item.district || "Hofuf")}
                  </p>
                </button>
              );
            })}

            {filteredLocations.length === 0 && (
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-5 text-[11px] text-white/55">
                No locations found.
              </div>
            )}
          </div>
        </div>
      </aside>

      {!showLeftPanel && !tourOpen && (
        <button
          onClick={() => setLeftCollapsed(false)}
          className="absolute left-6 top-28 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,14,22,0.88)] text-white shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:bg-[rgba(14,18,28,0.95)]"
          aria-label="Expand left panel"
        >
          <span className="text-lg leading-none">›</span>
        </button>
      )}

      {selectedLocation && (
        <aside
          className={`absolute right-6 top-28 bottom-6 z-20 w-[340px] max-w-[calc(100vw-3rem)] transition-all duration-300 ease-out ${
            showRightPanel
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,18,0.9)_0%,rgba(5,8,14,0.92)_100%)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-[13px] font-normal text-white/90">
                  {selectedLocation.title}
                </h2>
                <p className="mt-1 text-[11px] text-white/45">
                  {(selectedLocation.category || "Historical") +
                    " - " +
                    (selectedLocation.district || "Hofuf")}
                </p>
              </div>

              <button
                onClick={() => setRightCollapsed(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/78 transition duration-300 hover:scale-105 hover:bg-white/10"
                aria-label="Collapse right panel"
              >
                <span className="text-lg leading-none">›</span>
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-5 transition-all duration-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.05))]">
                <p className="mb-3 text-[10px] font-medium tracking-wide text-white/80">
                  Description
                </p>
                <p className="text-[11px] leading-5 text-white/72">
                  {selectedLocation.description || "No description available."}
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-5 transition-all duration-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.05))]">
                <p className="mb-3 text-[10px] font-medium tracking-wide text-white/80">
                  Location Details
                </p>
                <div className="space-y-2 text-[11px] leading-5 text-white/72">
                  <p>District: {selectedLocation.district || "Hofuf"}</p>
                  <p>
                    Coordinates: {selectedLocation.latitude}, {selectedLocation.longitude}
                  </p>
                </div>
              </div>

              {!!selectedLocation.category && (
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#a78743]/35 bg-[linear-gradient(180deg,rgba(240,213,138,0.12),rgba(191,147,67,0.08))] px-3 py-1 text-[9px] text-[#e4c87d] shadow-[inset_0_1px_0_rgba(255,248,224,0.14)] transition-all duration-300 hover:-translate-y-0.5">
                    {selectedLocation.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] text-white/65 transition-all duration-300 hover:-translate-y-0.5">
                    {selectedLocation.district || "Hofuf"}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <button
                onClick={() => {
                  if (selectedLocation?.tourUrl) {
                    setTourOpen(true);
                  }
                }}
                className="w-full rounded-full border border-[#a78743]/35 bg-[linear-gradient(180deg,#f4ddb0_0%,#e0bf79_30%,#cda357_65%,#b9883d_100%)] px-5 py-3.5 text-[12px] font-semibold text-[#17120a] shadow-[0_8px_22px_rgba(213,177,93,0.18),inset_0_1px_0_rgba(255,248,224,0.5)] transition duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!selectedLocation?.tourUrl}
              >
                Explore Tour
              </button>
            </div>
          </div>
        </aside>
      )}

      {tourOpen && selectedLocation && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[rgba(2,4,10,0.72)] p-4 backdrop-blur-md transition-all duration-300">
          <div className="relative flex h-[92vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,18,0.98)_0%,rgba(5,8,14,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                  Virtual Experience
                </p>
                <h2 className="truncate text-[14px] font-medium text-white/90">
                  {selectedLocation.title}
                </h2>
              </div>

              <button
                onClick={() => setTourOpen(false)}
                className="flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 text-[11px] font-medium text-white/85 transition duration-300 hover:bg-white/10"
              >
                Close Tour
              </button>
            </div>

            <div className="relative flex-1 bg-[#03060b]">
              {selectedLocation.tourUrl ? (
                <iframe
                  src={selectedLocation.tourUrl}
                  title={`${selectedLocation.title} Tour`}
                  className="h-full w-full"
                  allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-white/60">
                  No tour URL available for this location.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}