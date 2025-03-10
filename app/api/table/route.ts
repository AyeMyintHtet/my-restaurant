

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";


// API Route
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('buffet_table').select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}