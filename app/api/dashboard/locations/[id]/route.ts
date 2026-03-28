import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const payload = {
      title: body.title?.trim() || "",
      category: body.category?.trim() || "Historical",
      description: body.description?.trim() || "",
      district: body.district?.trim() || "",
      address: body.address?.trim() || "",
      image_url: body.image_url?.trim() || "",
      tour_url: body.tour_url?.trim() || "",
      contact_name: body.contact_name?.trim() || "",
      contact_phone: body.contact_phone?.trim() || "",
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      is_published: Boolean(body.is_published),
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
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid request body",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("locations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 }
    );
  }
}