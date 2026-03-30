"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Map as MapIcon,
  Satellite,
  X,
  Image as ImageIcon,
} from "lucide-react";

type LocationItem = {
  id: string | number;
  title: string;
  category?: string;
  description?: string;
  district?: string;
  latitude: number;
  longitude: number;
  is_published?: boolean;
  image?: string;
  images?: string[] | string | null;
  tour_url?: string;
  address?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
};

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 25.383,
  lng: 49.586,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  gestureHandling: "greedy",
};

const libraries: ("places")[] = ["places"];

function normalizeImages(location?: LocationItem | null): string[] {
  if (!location) return [];

  if (Array.isArray(location.images)) {
    return location.images.filter(Boolean);
  }

  if (typeof location.images === "string" && location.images.trim()) {
    const trimmed = location.images.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        // fallback
      }
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (location.image) return [location.image];

  return [];
}

function categoryBadge(category?: string) {
  return category || "Location";
}

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [tourLoading, setTourLoading] = useState(false);
  const [pendingTourUrl, setPendingTourUrl] = useState("");

  useEffect(() => {
    async function loadLocations() {
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

    loadLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setPanelOpen(true);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!isLoaded || !searchInputRef.current || searchBoxRef.current) return;

    searchBoxRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ["geometry", "name"],
    });

    searchBoxRef.current.addListener("place_changed", () => {
      const place = searchBoxRef.current?.getPlace();
      if (!place?.geometry?.location || !mapRef.current) return;

      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(14);
    });
  }, [isLoaded]);

  useEffect(() => {
    document.body.style.overflow = showTour ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTour]);

  const filteredLocations = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return locations;

    return locations.filter((item) => {
      const combined = [
        item.title,
        item.category,
        item.description,
        item.district,
        item.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return combined.includes(term);
    });
  }, [locations, searchValue]);

  const selectedImages = normalizeImages(selectedLocation);

  const goToLocation = (location: LocationItem) => {
    setSelectedLocation(location);
    setActiveImageIndex(0);

    if (mapRef.current) {
      mapRef.current.panTo({
        lat: Number(location.latitude),
        lng: Number(location.longitude),
      });
      mapRef.current.setZoom(15);
    }
  };

  const nextImage = () => {
    if (!selectedImages.length) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    if (!selectedImages.length) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const openTour = () => {
    const url = selectedLocation?.tour_url;
    if (!url) return;

    setTourLoading(true);
    setPendingTourUrl(url);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
      setShowTour(true);
      setTourLoading(false);

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 300);
    }, 650);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050811] text-white">
        Loading map...
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative h-screen w-full overflow-hidden bg-[#050811] text-white transition-all duration-700 ease-out ${
          showTour ? "blur-[6px] scale-[1.02]" : "blur-0 scale-100"
        }`}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={11}
          options={mapOptions}
          mapTypeId={mapType}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {filteredLocations.map((location) => {
            const isSelected =
              selectedLocation &&
              String(selectedLocation.id) === String(location.id);

            return (
              <Marker
                key={location.id}
                position={{
                  lat: Number(location.latitude),
                  lng: Number(location.longitude),
                }}
                onClick={() => goToLocation(location)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: isSelected ? 10 : 7,
                  fillColor: isSelected ? "#d4af37" : "#ffffff",
                  fillOpacity: 1,
                  strokeColor: isSelected ? "#fff4c2" : "#0b1220",
                  strokeWeight: isSelected ? 3 : 2,
                }}
              />
            );
          })}

          {selectedLocation && (
            <OverlayView
              position={{
                lat: Number(selectedLocation.latitude),
                lng: Number(selectedLocation.longitude),
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="relative -translate-x-1/2 -translate-y-[120%]">
                <div className="h-4 w-4 rounded-full bg-[#d4af37] ring-4 ring-white/30" />
              </div>
            </OverlayView>
          )}
        </GoogleMap>

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-4 transition-all duration-500 ease-out ${
            showTour ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="pointer-events-auto flex w-full max-w-5xl items-center gap-3 rounded-[24px] border border-[#d4af37]/15 bg-[#07111d]/80 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <button className="rounded-full border border-[#d4af37]/30 bg-gradient-to-b from-[#f0d27a] to-[#b88a2d] px-6 py-3 text-[13px] font-medium text-[#1b1407] shadow-[0_10px_25px_rgba(212,175,55,0.28)]">
              Home
            </button>

            <div className="flex items-center overflow-hidden rounded-[18px] border border-[#d4af37]/20 bg-white/[0.04]">
              <button
                onClick={() => setMapType("roadmap")}
                className={`flex items-center gap-2 px-5 py-3 text-[13px] transition ${
                  mapType === "roadmap"
                    ? "bg-gradient-to-b from-[#efcf74] to-[#b88a2d] text-[#1c1508]"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <MapIcon className="h-4 w-4" />
                Map
              </button>

              <button
                onClick={() => setMapType("satellite")}
                className={`flex items-center gap-2 px-5 py-3 text-[13px] transition ${
                  mapType === "satellite"
                    ? "bg-gradient-to-b from-[#efcf74] to-[#b88a2d] text-[#1c1508]"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Satellite className="h-4 w-4" />
                Satellite
              </button>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-white/45" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent text-[14px] text-white placeholder:text-white/35 outline-none"
              />
            </div>

            <button className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[13px] font-medium text-white/90">
              All
            </button>
          </div>
        </div>

        <div
          className={`absolute left-4 top-28 bottom-4 z-20 hidden w-[290px] lg:block transition-all duration-500 ease-out ${
            showTour ? "opacity-0 pointer-events-none -translate-x-5" : "opacity-100 translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.94),rgba(2,6,15,0.96))] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[18px] font-medium text-white">Locations</h2>

              <div className="flex items-center gap-2">
                <div className="flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-2 text-[12px] text-white/70">
                  {filteredLocations.length}
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
                  ‹
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {filteredLocations.map((location) => {
                const isActive =
                  selectedLocation &&
                  String(selectedLocation.id) === String(location.id);

                return (
                  <button
                    key={location.id}
                    onClick={() => goToLocation(location)}
                    className={`w-full rounded-[24px] border px-4 py-5 text-left transition ${
                      isActive
                        ? "border-[#d4af37]/35 bg-white/[0.06] shadow-[0_12px_30px_rgba(212,175,55,0.10)]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <h3 className="text-[15px] font-medium text-white">
                      {location.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-white/55">
                      {location.category || "Location"}
                      {location.district ? ` - ${location.district}` : ""}
                    </p>
                  </button>
                );
              })}

              {filteredLocations.length === 0 && (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-[14px] text-white/55">
                  No matching locations found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`absolute right-4 top-28 bottom-4 z-30 w-[390px] max-w-[calc(100vw-2rem)] transition-all duration-500 ease-out md:w-[430px] ${
            panelOpen && selectedLocation && !showTour
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-[110%] opacity-0"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,24,0.96),rgba(4,8,16,0.98))] shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            {selectedLocation && (
              <>
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Selected Location
                    </div>
                    <h2 className="mt-1 text-[18px] font-medium text-white">
                      {selectedLocation.title}
                    </h2>
                    <p className="mt-2 text-[14px] text-white/60">
                      {selectedLocation.category || "Location"}
                      {selectedLocation.district ? ` • ${selectedLocation.district}` : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => setPanelOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-5 p-5">
                    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
                      {selectedImages.length > 0 ? (
                        <>
                          <div className="group relative aspect-[16/10] w-full overflow-hidden bg-black">
                            <img
                              src={selectedImages[activeImageIndex]}
                              alt={`${selectedLocation.title} ${activeImageIndex + 1}`}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[12px] text-white/85 backdrop-blur-md">
                              {activeImageIndex + 1} / {selectedImages.length}
                            </div>

                            {selectedImages.length > 1 && (
                              <>
                                <button
                                  onClick={prevImage}
                                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={nextImage}
                                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>

                          {selectedImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 border-t border-white/10 p-2">
                              {selectedImages.map((img, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`overflow-hidden rounded-[14px] border transition ${
                                    index === activeImageIndex
                                      ? "border-[#d4af37]/70"
                                      : "border-white/10 hover:border-white/20"
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`${selectedLocation.title} thumbnail ${index + 1}`}
                                    className="h-16 w-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03]">
                          <div className="text-center">
                            <ImageIcon className="mx-auto mb-3 h-7 w-7 text-white/25" />
                            <p className="text-[13px] text-white/45">No images available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedLocation.description && (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                          Description
                        </div>
                        <p className="text-[14px] leading-7 text-white/72">
                          {selectedLocation.description}
                        </p>
                      </div>
                    )}

                    {selectedLocation.district && (
                      <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-white/35">
                          Location Details
                        </div>
                        <div className="space-y-2 text-[14px] text-white/80">
                          <div>District: {selectedLocation.district}</div>
                          <div>
                            Coordinates: {Number(selectedLocation.latitude).toFixed(2)}, {Number(selectedLocation.longitude).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/8 px-3 py-1.5 text-[12px] text-[#f3df94]">
                        {categoryBadge(selectedLocation.category)}
                      </div>
                      {selectedLocation.district && (
                        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70">
                          {selectedLocation.district}
                        </div>
                      )}
                    </div>

                    {(selectedLocation.tour_url || pendingTourUrl) && (
                      <button
                        onClick={openTour}
                        className="w-full rounded-[20px] border border-[#d4af37]/30 bg-gradient-to-b from-[#f0d27a] to-[#b88a2d] px-4 py-4 text-[14px] font-medium text-[#1b1407] shadow-[0_14px_35px_rgba(212,175,55,0.20)] transition hover:scale-[1.01]"
                      >
                        Explore Tour
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {tourLoading && (
          <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/88 backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/40">
                Virtual Experience
              </div>
              <div className="text-[18px] font-medium text-white">Opening Experience</div>
              <div className="mt-4 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/2 animate-[loadingBar_1s_ease-in-out_infinite] rounded-full bg-[#d4af37]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {showTour && (selectedLocation?.tour_url || pendingTourUrl) && (
        <div className="fixed inset-0 z-[999] flex flex-col bg-black/95 backdrop-blur-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(7,17,29,0.92),rgba(7,17,29,0.78))] px-8 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/40">
                Virtual Experience
              </div>
              <div className="mt-1 text-[18px] font-medium text-white">
                {selectedLocation?.title}
              </div>
            </div>

            <button
              onClick={() => setShowTour(false)}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[13px] text-white transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            >
              Close Tour
            </button>
          </div>

          <div className="relative flex-1">
            <iframe
              src={selectedLocation?.tour_url || pendingTourUrl}
              className="h-full w-full border-0"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          </div>
        </div>
      )}
    </>
  );
}