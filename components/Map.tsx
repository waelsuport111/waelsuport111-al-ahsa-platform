"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState } from "react";

type MapLocation = {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
};

const mapStyles = [
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

const defaultCenter = {
  lat: 25.3839,
  lng: 49.586,
};

const demoLocations: MapLocation[] = [
  {
    id: 1,
    title: "Ibrahim Palace",
    latitude: 25.383,
    longitude: 49.586,
  },
];

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const center = useMemo(() => defaultCenter, []);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#081225] text-white">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#081225]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        mapTypeId={mapType}
        options={{
          styles: mapType === "roadmap" ? mapStyles : undefined,
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          clickableIcons: false,
        }}
      >
        {demoLocations.map((location) => (
          <Marker
            key={location.id}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            onClick={() => setSelectedId(location.id)}
            icon={
              selectedId === location.id
                ? {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }
                : undefined
            }
          />
        ))}
      </GoogleMap>

      <div className="absolute left-4 top-4 z-20 flex items-center rounded-[22px] border border-white/10 bg-[#0d1728]/88 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <button
          onClick={() => setMapType("roadmap")}
          className={`rounded-[16px] px-5 py-3 text-sm font-semibold transition ${
            mapType === "roadmap"
              ? "bg-white text-black"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType("satellite")}
          className={`rounded-[16px] px-5 py-3 text-sm font-semibold transition ${
            mapType === "satellite"
              ? "bg-white text-black"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          Satellite
        </button>
      </div>
    </div>
  );
}