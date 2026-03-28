"use client";

import Link from "next/link";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Category =
  | "All"
  | "Tourism"
  | "Public Services"
  | "Historical"
  | "Market"
  | "Municipality"
  | "General";

type LocationItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  images: string[];
};

function getPinIcon(category: string, isSelected: boolean) {
  const size = isSelected ? 50 : 36;
  const base = "https://maps.google.com/mapfiles/ms/icons/";

  switch (category) {
    case "Tourism":
      return {
        url: `${base}green-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
    case "Public Services":
      return {
        url: `${base}blue-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
    case "Historical":
      return {
        url: `${base}orange-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
    case "Market":
      return {
        url: `${base}purple-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
    case "Municipality":
      return {
        url: `${base}yellow-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
    default:
      return {
        url: `${base}red-dot.png`,
        scaledSize: new google.maps.Size(size, size),
      };
  }
}

export default function Map() {
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selected, setSelected] = useState<LocationItem | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const [showSide, setShowSide] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [activeImage, setActiveImage] = useState(0);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => ({ lat: 25.383, lng: 49.586 }), []);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_published", true);

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const formatted: LocationItem[] = (data || [])
        .map((item: any) => ({
          id: Number(item.id),
          title: item.title || "",
          category: item.category || "General",
          description: item.description || "",
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          images: [item.image_1, item.image_2, item.image_3].filter(Boolean),
        }))
        .filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));

      setLocations(formatted);

      if (formatted.length > 0) {
        setSelected(formatted[0]);
        setActiveImage(0);
      } else {
        setSelected(null);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    let data = locations;

    if (selectedCategory !== "All") {
      data = data.filter((loc) => loc.category === selectedCategory);
    }

    if (search.trim()) {
      const value = search.toLowerCase();
      data = data.filter(
        (loc) =>
          loc.title.toLowerCase().includes(value) ||
          loc.description.toLowerCase().includes(value) ||
          loc.category.toLowerCase().includes(value)
      );
    }

    return data;
  }, [locations, search, selectedCategory]);

  useEffect(() => {
    if (!selected) return;

    const stillExists = filteredLocations.some((loc) => loc.id === selected.id);

    if (!stillExists) {
      if (filteredLocations.length > 0) {
        setSelected(filteredLocations[0]);
        setActiveImage(0);
      } else {
        setSelected(null);
      }
    }
  }, [filteredLocations, selected]);

  const handleSelectLocation = (loc: LocationItem) => {
    setSelected(loc);
    setShowDetails(true);
    setActiveImage(0);
  };

  const toggleMapType = () => {
    const nextType = mapType === "roadmap" ? "satellite" : "roadmap";
    setMapType(nextType);

    if (mapRef.current) {
      mapRef.current.setMapTypeId(nextType);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-sm text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <GoogleMap
        zoom={13}
        center={selected ? { lat: selected.lat, lng: selected.lng } : center}
        mapContainerClassName="h-full w-full"
        mapTypeId="satellite"
        onLoad={(map) => {
          mapRef.current = map;
          map.setMapTypeId("satellite");
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        {filteredLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => handleSelectLocation(loc)}
            icon={getPinIcon(loc.category, selected?.id === loc.id)}
          />
        ))}
      </GoogleMap>

      <Link
        href="/"
        className="absolute left-6 top-6 z-20 rounded-full border border-white/20 bg-white/85 px-4 py-2 text-xs font-medium text-gray-800 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
      >
        Home
      </Link>

      {showSearch && (
        <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-white/75 px-6 py-3 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="All">All</option>
            <option value="Tourism">Tourism</option>
            <option value="Public Services">Public Services</option>
            <option value="Historical">Historical</option>
            <option value="Market">Market</option>
            <option value="Municipality">Municipality</option>
            <option value="General">General</option>
          </select>

          <button
            onClick={toggleMapType}
            className="rounded-full bg-black px-3 py-1 text-xs text-white"
          >
            {mapType === "roadmap" ? "Switch to Satellite" : "Switch to Map"}
          </button>

          <button
            onClick={() => setShowSearch(false)}
            className="text-xs text-gray-500"
          >
            Hide
          </button>
        </div>
      )}

      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-white/85 px-4 py-2 text-xs font-medium text-gray-800 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        >
          Show Search
        </button>
      )}

      {showSide && (
        <div className="absolute left-6 top-1/2 z-20 w-72 -translate-y-1/2 rounded-2xl bg-white/75 p-4 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
          <h2 className="mb-3 text-lg font-semibold">Locations</h2>

          <div className="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={`cursor-pointer rounded-lg p-3 transition ${
                  selected?.id === loc.id ? "bg-black/5" : "hover:bg-black/5"
                }`}
              >
                <p className="text-sm font-medium">{loc.title}</p>
                <p className="text-xs text-gray-500">{loc.category}</p>
              </div>
            ))}

            {filteredLocations.length === 0 && (
              <p className="px-1 py-3 text-sm text-gray-500">No locations found.</p>
            )}
          </div>

          <button
            onClick={() => setShowSide(false)}
            className="mt-4 text-xs text-gray-400"
          >
            Hide
          </button>
        </div>
      )}

      {!showSide && (
        <button
          onClick={() => setShowSide(true)}
          className="absolute left-24 top-6 z-20 rounded-full border border-white/20 bg-white/85 px-4 py-2 text-xs font-medium text-gray-800 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        >
          Show Menu
        </button>
      )}

      {selected && showDetails && (
        <div className="absolute right-6 top-1/2 z-20 w-[380px] -translate-y-1/2 rounded-2xl bg-white/80 p-5 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
          {selected.images.length > 0 && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img
                src={selected.images[activeImage]}
                alt={selected.title}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {selected.images.length > 1 && (
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {selected.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border ${
                    activeImage === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${selected.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold">{selected.title}</h2>
          <p className="text-sm text-gray-500">{selected.category}</p>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {selected.description}
          </p>

          <button className="mt-4 w-full rounded-lg bg-black py-2 text-sm text-white">
            Explore Tour
          </button>

          <button
            onClick={() => setShowDetails(false)}
            className="mt-3 text-xs text-gray-400"
          >
            Hide
          </button>
        </div>
      )}

      {!showDetails && selected && (
        <button
          onClick={() => setShowDetails(true)}
          className="absolute right-6 top-6 z-20 rounded-full border border-white/20 bg-white/85 px-4 py-2 text-xs font-medium text-gray-800 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        >
          Show Details
        </button>
      )}
    </div>
  );
}