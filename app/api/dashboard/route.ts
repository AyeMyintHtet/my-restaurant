import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("customer")
          .select(
            `
            *,
            buffet_table:table_id(
              table_no
            ),
            tier_list:tier_id (
              id,
              name,
              amount,
              level
            )
          `
          )
          .eq("paid",false)
          .order("created_at", { ascending: true });
    
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
export async function POST(req: NextRequest){
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { data, error } = await supabase
          .from("customer")
          .insert(body)
          .select()
          .single();
    
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data, {
          status: 201,
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
        const body = await req.json();
        const { id, ...updateData } = body;
    
        const { data, error } = await supabase
          .from("customer")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();
    
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