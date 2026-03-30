import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

function normalizeLocation(row: any) {
  const images = Array.isArray(row.images)
    ? row.images
    : [
        row.image_1,
        row.image_2,
        row.image_3,
        row.image_url,
      ].filter(Boolean);

  return {
    id: row.id,
    title: row.title ?? "",
    category: row.category ?? "",
    description: row.description ?? "",
    district: row.district ?? "",
    latitude: Number(row.latitude ?? 0),
    longitude: Number(row.longitude ?? 0),
    locationDetails:
      row.location_details ??
      row.contact_details ??
      "",
    contactLabel:
      row.contact_label ??
      row.contact_name ??
      "Contact",
    contactValue:
      row.contact_value ??
      row.contact_phone ??
      "",
    tourUrl: row.tour_url ?? "",
    images,
    isPublished:
      typeof row.is_published === "boolean" ? row.is_published : true,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = (data ?? []).map(normalizeLocation);

  return NextResponse.json(normalized);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const images = Array.isArray(body.images) ? body.images : [];

    const payload = {
      title: body.title || "",
      category: body.category || "",
      description: body.description || "",
      district: body.district || "",
      latitude: Number(body.latitude || 0),
      longitude: Number(body.longitude || 0),
      location_details: body.locationDetails || "",
      contact_label: body.contactLabel || "Contact",
      contact_value: body.contactValue || "",
      tour_url: body.tourUrl || "",
      images,
      image_1: images[0] || null,
      image_2: images[1] || null,
      image_3: images[2] || null,
      image_url: images[0] || null,
      contact_name: body.contactLabel || "Contact",
      contact_phone: body.contactValue || "",
      contact_details: body.locationDetails || "",
      is_published: Boolean(body.isPublished),
    };

    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(normalizeLocation(data));
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}