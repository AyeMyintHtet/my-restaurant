import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("buffet_table").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { id, updates } = await req.json(); // Expect { id, updates } from request body

    if (!id || !updates) {
      return NextResponse.json(
        { error: "Missing id or updates" },
        { status: 400 }
      );
    }
    console.log('body', updates);
    const { data, error } = await supabase
      .from("buffet_table")
      .update(updates)
      .match({ id });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error: "A table with this number already exists.",
            hint: "Try using a unique table number.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "success", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const id = req.nextUrl.searchParams.get("id");

    const { data, error } = await supabase
      .from("buffet_table")
      .delete()
      .match({ id });

    if (error) {
      console.log('errorrrr',error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log('success',data)
    return NextResponse.json(
      { message: "success", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("buffet_table")
      .insert([body]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error: "A table with this number already exists.",
            hint: "Try using a unique table number.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "success", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
