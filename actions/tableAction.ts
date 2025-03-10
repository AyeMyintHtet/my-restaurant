import apiMiddleware from "@/app/api/middleware";
import { createClient } from "@/utils/supabase/client";


async function fetchBuffetTable() {
  const supabase = await createClient(); // Initialize Supabase

  const getBuffetTableInfo = async () => {
    const { data, error } = await supabase.from('buffet_table').select('*');
    if (error) throw new Error(error.message);
    return data;
  };

  return { 
    
    getTable: await getBuffetTableInfo() ,

  
  };
}

const buffetTableAction = apiMiddleware(fetchBuffetTable);
export default await buffetTableAction();

