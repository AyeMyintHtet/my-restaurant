import { IDatabases } from "@/types/supabase_db.types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const table_name = req.nextUrl.searchParams.get("table_name");
    if (!table_name) {
      return NextResponse.json(
        { error: "There is no database to fetch" },
        { status: 500 }
      );
    }
    const { data, error } = await supabase.from(table_name).select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req:NextRequest){
  try {
    const supabase = await createClient();
    const table_name = req.nextUrl.searchParams.get("table_name");
    const body = await req.json();
    console.log('body received in POST:', body);
    if (!table_name) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { data, error } = await supabase.from(table_name).insert([body]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "success", data }, { status: 200 });
  } catch (err) {
    console.log('Error in POST request:', err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
export async function PATCH(req:NextRequest){
  try {
    const supabase = await createClient();
    const table_name = req.nextUrl.searchParams.get("table_name");
    const {id, ...props} = await req.json();
    if (!table_name) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const updates = props.updates;
    const { data, error } = await supabase.from(table_name).update(updates).match({id});
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "success", data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

}
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const id = req.nextUrl.searchParams.get("id");
    const table_name = req.nextUrl.searchParams.get("table_name");
    if (!id || !table_name) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from(table_name)
      .delete()
      .match({ id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "success", data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
