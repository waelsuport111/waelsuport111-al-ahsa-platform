import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      title: body.title || "",
      category: body.category || "Tourism",
      description: body.description || "",
      district: body.district || "",
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      image_url: body.image_url || "",
      is_published: true,
    };

    if (!payload.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      return NextResponse.json(
        { error: "Latitude and longitude must be valid numbers" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}