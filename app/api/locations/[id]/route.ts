import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const payload = {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.district !== undefined ? { district: body.district } : {}),
      ...(body.latitude !== undefined ? { latitude: Number(body.latitude) } : {}),
      ...(body.longitude !== undefined ? { longitude: Number(body.longitude) } : {}),
      ...(body.image_url !== undefined ? { image_url: body.image_url } : {}),
      ...(body.location_details !== undefined ? { location_details: body.location_details } : {}),
      ...(body.tour_url !== undefined ? { tour_url: body.tour_url } : {}),
      ...(body.contact_details !== undefined ? { contact_details: body.contact_details } : {}),
      ...(body.is_published !== undefined ? { is_published: body.is_published } : {}),
    };

    const { data, error } = await supabaseAdmin
      .from("locations")
      .update(payload)
      .eq("id", id)
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("locations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}