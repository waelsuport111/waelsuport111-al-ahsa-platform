import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("locations")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const payload = {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.district !== undefined ? { district: body.district } : {}),
      ...(body.latitude !== undefined ? { latitude: Number(body.latitude) } : {}),
      ...(body.longitude !== undefined ? { longitude: Number(body.longitude) } : {}),
      ...(body.image_url !== undefined ? { image_url: body.image_url } : {}),
      ...(body.is_published !== undefined ? { is_published: body.is_published } : {}),
    };

    const { error } = await supabaseAdmin
      .from("locations")
      .update(payload)
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}