"use client";

import { useEffect, useMemo, useState } from "react";

type RawLocationItem = {
  id: number;
  title: string | null;
  category: string | null;
  description: string | null;
  district: string | null;
  address?: string | null;
  image_url?: string | null;
  image_1?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  tour_url?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_details?: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  is_published: boolean | null;
  created_at?: string | null;
};

type LocationItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  district: string;
  address: string;
  image_url: string;
  image_2: string;
  image_3: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  latitude: number;
  longitude: number;
  is_published: boolean;
  created_at?: string;
};

type FormState = {
  title: string;
  category: string;
  description: string;
  district: string;
  address: string;
  image_url: string;
  image_2: string;
  image_3: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  latitude: string;
  longitude: string;
  is_published: boolean;
};

const CATEGORY_OPTIONS = [
  "Historical",
  "Tourism",
  "Municipality",
  "Culture",
  "Events",
  "Heritage",
  "Parks",
  "Public Services",
];

const emptyForm: FormState = {
  title: "",
  category: "Historical",
  description: "",
  district: "",
  address: "",
  image_url: "",
  image_2: "",
  image_3: "",
  tour_url: "",
  contact_name: "",
  contact_phone: "",
  latitude: "",
  longitude: "",
  is_published: false,
};

function normalizeLocation(item: RawLocationItem): LocationItem {
  return {
    id: Number(item.id),
    title: item.title ?? "",
    category: item.category ?? "Historical",
    description: item.description ?? "",
    district: item.district ?? "",
    address: item.address ?? "",
    image_url: item.image_url ?? item.image_1 ?? "",
    image_2: item.image_2 ?? "",
    image_3: item.image_3 ?? "",
    tour_url: item.tour_url ?? "",
    contact_name: item.contact_name ?? item.contact_details ?? "",
    contact_phone: item.contact_phone ?? "",
    latitude: Number(item.latitude ?? 0),
    longitude: Number(item.longitude ?? 0),
    is_published: Boolean(item.is_published),
    created_at: item.created_at ?? undefined,
  };
}

export default function DashboardPage() {
  const [items, setItems] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState("");

  async function loadLocations() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/dashboard/locations", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setItems([]);
        setMessage(data.error || "Failed to load locations");
        return;
      }

      const normalized = Array.isArray(data)
        ? data.map((item) => normalizeLocation(item as RawLocationItem))
        : [];

      setItems(normalized);
    } catch {
      setItems([]);
      setMessage("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(item: LocationItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      district: item.district,
      address: item.address,
      image_url: item.image_url,
      image_2: item.image_2,
      image_3: item.image_3,
      tour_url: item.tour_url,
      contact_name: item.contact_name,
      contact_phone: item.contact_phone,
      latitude: String(item.latitude),
      longitude: String(item.longitude),
      is_published: item.is_published,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        district: form.district,
        address: form.address,
        image_url: form.image_url,
        image_1: form.image_url,
        image_2: form.image_2,
        image_3: form.image_3,
        tour_url: form.tour_url,
        contact_name: form.contact_name,
        contact_phone: form.contact_phone,
        contact_details: form.contact_name,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        is_published: form.is_published,
      };

      const url = editingId
        ? `/api/dashboard/locations/${editingId}`
        : "/api/dashboard/locations";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save location");
        return;
      }

      setMessage(editingId ? "Location updated successfully" : "Location created successfully");
      resetForm();
      await loadLocations();
    } catch {
      setMessage("Failed to save location");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this location?");
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/dashboard/locations/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to delete location");
        return;
      }

      setMessage("Location deleted successfully");
      await loadLocations();
    } catch {
      setMessage("Failed to delete location");
    } finally {
      setDeletingId(null);
    }
  }

  async function togglePublish(item: LocationItem) {
    setMessage("");

    try {
      const res = await fetch(`/api/dashboard/locations/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          description: item.description,
          district: item.district,
          address: item.address,
          image_url: item.image_url,
          image_1: item.image_url,
          image_2: item.image_2,
          image_3: item.image_3,
          tour_url: item.tour_url,
          contact_name: item.contact_name,
          contact_phone: item.contact_phone,
          contact_details: item.contact_name,
          latitude: item.latitude,
          longitude: item.longitude,
          is_published: !item.is_published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to update publish status");
        return;
      }

      setMessage(data.is_published ? "Location published" : "Location unpublished");
      await loadLocations();
    } catch {
      setMessage("Failed to update publish status");
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "published"
          ? item.is_published
          : !item.is_published;

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  return (
    <main className="min-h-screen bg-[#081225] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Private CMS</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Al Ahsa Dashboard
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Manage locations privately. This page is separate from the public home page.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-2xl font-semibold">{items.length}</div>
              <div className="text-xs text-white/50">Total</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-2xl font-semibold">
                {items.filter((i) => i.is_published).length}
              </div>
              <div className="text-xs text-white/50">Published</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-2xl font-semibold">
                {items.filter((i) => !i.is_published).length}
              </div>
              <div className="text-xs text-white/50">Drafts</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Location" : "Add New Location"}
              </h2>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(v) => updateForm("title", v)}
                placeholder="Ibrahim Palace"
              />

              <SelectInput
                label="Category"
                value={form.category}
                onChange={(v) => updateForm("category", v)}
                options={CATEGORY_OPTIONS}
              />

              <TextArea
                label="Description"
                value={form.description}
                onChange={(v) => updateForm("description", v)}
                placeholder="Short description of the location"
              />

              <Input
                label="District"
                value={form.district}
                onChange={(v) => updateForm("district", v)}
                placeholder="Al Hofuf"
              />

              <Input
                label="Address"
                value={form.address}
                onChange={(v) => updateForm("address", v)}
                placeholder="Full address"
              />

              <Input
                label="Main Image URL"
                value={form.image_url}
                onChange={(v) => updateForm("image_url", v)}
                placeholder="https://..."
              />

              <Input
                label="Second Image URL"
                value={form.image_2}
                onChange={(v) => updateForm("image_2", v)}
                placeholder="https://..."
              />

              <Input
                label="Third Image URL"
                value={form.image_3}
                onChange={(v) => updateForm("image_3", v)}
                placeholder="https://..."
              />

              <Input
                label="Tour URL"
                value={form.tour_url}
                onChange={(v) => updateForm("tour_url", v)}
                placeholder="https://..."
              />

              <Input
                label="Contact Name / Details"
                value={form.contact_name}
                onChange={(v) => updateForm("contact_name", v)}
                placeholder="Tourism Authority"
              />

              <Input
                label="Contact Phone"
                value={form.contact_phone}
                onChange={(v) => updateForm("contact_phone", v)}
                placeholder="+966..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  value={form.latitude}
                  onChange={(v) => updateForm("latitude", v)}
                  placeholder="25.383"
                />
                <Input
                  label="Longitude"
                  value={form.longitude}
                  onChange={(v) => updateForm("longitude", v)}
                  placeholder="49.586"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => updateForm("is_published", e.target.checked)}
                  className="h-4 w-4 accent-white"
                />
                Publish this location
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Location" : "Create Location"}
              </button>

              {message && (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                  {message}
                </div>
              )}
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-xl font-semibold">All Locations</h2>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, category, district..."
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 md:w-80"
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "all" | "published" | "draft")
                  }
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
                Loading locations...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
                No locations found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                            {item.category}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              item.is_published
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {item.is_published ? "Published" : "Draft"}
                          </span>
                        </div>

                        <p className="mb-3 text-sm text-white/65">{item.description}</p>

                        <div className="grid gap-2 text-sm text-white/60 md:grid-cols-2">
                          <div>
                            <span className="text-white/35">District:</span> {item.district || "-"}
                          </div>
                          <div>
                            <span className="text-white/35">Address:</span> {item.address || "-"}
                          </div>
                          <div>
                            <span className="text-white/35">Latitude:</span> {item.latitude}
                          </div>
                          <div>
                            <span className="text-white/35">Longitude:</span> {item.longitude}
                          </div>
                          <div>
                            <span className="text-white/35">Contact:</span> {item.contact_name || "-"}
                          </div>
                          <div>
                            <span className="text-white/35">Phone:</span> {item.contact_phone || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <button
                          onClick={() => togglePublish(item)}
                          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                        >
                          {item.is_published ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          onClick={() => startEdit(item)}
                          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
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

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0b1220] text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </div>
  );
}