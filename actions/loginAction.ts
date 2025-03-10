"use server";

import { loginSchema } from "@/schema/loginSchema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {z} from 'zod'

export async function submitForm(prevState: any, formData: FormData) {
  try {
    // Parse and validate the form data using Zod
    const supabase = await createClient()
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedData = loginSchema.parse(rawFormData);

    const {data, error} = await supabase.auth.signInWithPassword(validatedData);
    if(data){
      return { status:'success', formData: data };
    }
    return { error: error?.message };

    
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.log(error);
    return { error: "An unexpected error occurred." };
  }
}
