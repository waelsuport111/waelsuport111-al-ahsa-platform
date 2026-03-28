import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}