"use client";

import { useEffect, useMemo, useState } from "react";
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
  is_published: boolean;
};

const mapContainerStyle = {
  width: "100%",
  height: "240px",
};

const defaultCenter = {
  lat: 25.3839,
  lng: 49.586,
};

const categories = [
  "Tourism",
  "Historical",
  "Municipality",
  "Culture",
  "Entertainment",
  "Hospitality",
  "Public Service",
];

export default function CmsSecurePage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Tourism",
    description: "",
    district: "",
    latitude: "",
    longitude: "",
    image_url: "",
  });

  const selectedPosition = useMemo(() => {
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  }, [form.latitude, form.longitude]);

  async function fetchLocations() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/locations", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      category: "Tourism",
      description: "",
      district: "",
      latitude: "",
      longitude: "",
      image_url: "",
    });
    setEditingId(null);
  }

  function handleMapClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;

    setForm((prev) => ({
      ...prev,
      latitude: String(e.latLng?.lat() ?? ""),
      longitude: String(e.latLng?.lng() ?? ""),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      const url =
        editingId !== null
          ? `/api/locations/${editingId}`
          : "/api/admin/locations";

      const method = editingId !== null ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      await fetchLocations();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save location");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this location?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchLocations();
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  }

  async function handleTogglePublish(item: LocationItem) {
    try {
      const res = await fetch(`/api/locations/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !item.is_published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update publish status");
        return;
      }

      await fetchLocations();
    } catch (error) {
      console.error(error);
      alert("Failed to update publish status");
    }
  }

  function handleEdit(item: LocationItem) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "Tourism",
      description: item.description || "",
      district: item.district || "",
      latitude: String(item.latitude ?? ""),
      longitude: String(item.longitude ?? ""),
      image_url: item.image_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Al Ahsa CMS</h1>

          <button className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold">
              {editingId !== null ? "Edit Location" : "Add Location"}
            </h2>

            {isLoaded ? (
              <>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedPosition || defaultCenter}
                    zoom={selectedPosition ? 14 : 10}
                    onClick={handleMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: true,
                      fullscreenControl: true,
                    }}
                  >
                    {selectedPosition && <Marker position={selectedPosition} />}
                  </GoogleMap>
                </div>

                <p className="mt-2 text-xs text-white/60">
                  Click on the map to fill latitude and longitude automatically.
                </p>
              </>
            ) : (
              <div className="flex h-[240px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60">
                Loading map...
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
              />

              <input
                type="text"
                placeholder="District"
                value={form.district}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, district: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, latitude: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
                />

                <input
                  type="text"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, longitude: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
                />
              </div>

              <input
                type="text"
                placeholder="Image URL"
                value={form.image_url}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image_url: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-white/35"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Location"
                    : "Add Location"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Saved Locations</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                {locations.length} items
              </span>
            </div>

            {loading ? (
              <div className="text-sm text-white/60">Loading locations...</div>
            ) : locations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-white/50">
                No locations added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {locations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">{item.title}</h3>
                        <p className="text-sm text-white/50">
                          {item.category} • {item.district || "No district"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.is_published
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-sm text-white/70">
                      {item.description || "No description"}
                    </p>

                    <div className="mb-3 text-xs text-white/45">
                      {item.latitude}, {item.longitude}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleTogglePublish(item)}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10"
                      >
                        {item.is_published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}