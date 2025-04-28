import { createClient } from "./supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  const { data:{session}, error } = await supabase.auth.getSession();

  return { user: session?.user, error , session};
};
