"use client";

import { useEffect, useMemo, useState } from "react";

type LocationItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  district: string;
  latitude: number;
  longitude: number;
  locationDetails: string;
  contactLabel: string;
  contactValue: string;
  tourUrl: string;
  images: string[];
  isPublished: boolean;
};

const emptyForm = {
  title: "",
  category: "",
  description: "",
  district: "",
  latitude: "",
  longitude: "",
  locationDetails: "",
  contactLabel: "",
  contactValue: "",
  tourUrl: "",
  imagesText: "",
  isPublished: true,
};

export default function DashboardPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  async function loadLocations() {
    try {
      const response = await fetch("/api/locations", { cache: "no-store" });
      const data: LocationItem[] = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  const publishedCount = useMemo(
    () => locations.filter((item) => item.isPublished).length,
    [locations]
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      district: form.district,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      locationDetails: form.locationDetails,
      contactLabel: form.contactLabel,
      contactValue: form.contactValue,
      tourUrl: form.tourUrl,
      images: form.imagesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      isPublished: form.isPublished,
    };

    const response = await fetch("/api/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Failed to create location");
      return;
    }

    setForm(emptyForm);
    await loadLocations();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-white/40 uppercase">
              Private CMS
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
              Al Ahsa Dashboard
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/75">
            Total Published: {publishedCount}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,17,31,0.92)_0%,rgba(8,12,24,0.86)_100%)] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-5">
              <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
                Create Location
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                New destination
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="District"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="Latitude"
                  className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                  required
                />

                <input
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  placeholder="Longitude"
                  className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                  required
                />
              </div>

              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={4}
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <textarea
                value={form.locationDetails}
                onChange={(e) =>
                  setForm({ ...form, locationDetails: e.target.value })
                }
                placeholder="Location details"
                rows={4}
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <input
                value={form.contactLabel}
                onChange={(e) =>
                  setForm({ ...form, contactLabel: e.target.value })
                }
                placeholder="Contact label"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <input
                value={form.contactValue}
                onChange={(e) =>
                  setForm({ ...form, contactValue: e.target.value })
                }
                placeholder="Contact value"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <input
                value={form.tourUrl}
                onChange={(e) => setForm({ ...form, tourUrl: e.target.value })}
                placeholder="Tour URL"
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
                required
              />

              <textarea
                value={form.imagesText}
                onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                placeholder="Image URLs, one per line"
                rows={5}
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none"
              />

              <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm({ ...form, isPublished: e.target.checked })
                  }
                />
                Publish now
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-[#d6b36a] px-5 py-3 text-sm font-semibold tracking-[0.14em] text-black uppercase transition hover:scale-[1.01]"
              >
                Create Location
              </button>
            </form>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,17,31,0.92)_0%,rgba(8,12,24,0.86)_100%)] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
                  Locations
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Current published destinations
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4 text-white/70">
                Loading...
              </div>
            ) : (
              <div className="space-y-4">
                {locations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs tracking-[0.18em] text-white/40 uppercase">
                          {item.category}
                        </p>
                        <h3 className="mt-2 text-xl font-medium text-white">
                          {item.title}
                        </h3>
                      </div>

                      <div className="rounded-full border border-[#d6b36a]/30 bg-[#d6b36a]/10 px-3 py-1 text-xs text-[#d6b36a]">
                        Published
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {item.description}
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-3 text-sm text-white/70">
                        District: {item.district}
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-3 text-sm text-white/70">
                        Lat: {item.latitude}
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-3 text-sm text-white/70">
                        Lng: {item.longitude}
                      </div>
                    </div>
                  </div>
                ))}

                {locations.length === 0 && (
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4 text-white/70">
                    No locations yet.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}