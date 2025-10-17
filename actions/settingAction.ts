import { fetchApi } from "@/lib/api";
import { IDatabases } from "@/types/supabase_db.types";

const settingAction = {
  async getTableList(table_name: IDatabases): Promise<any> {
    try {
      const response = await fetchApi(`/api/setting?table_name=${table_name}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching table list:", error);
      return [];
    }
  },
  async deleteRow(table_name: IDatabases, id: number) {
    try {
      const response = await fetchApi(
        `/api/setting?table_name=${table_name}&id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting buffet table:", error);
      return null;
    }
  },
  async updateTable(prevState: any, formData: FormData) {
    try {
      const { id, table_name, ...updates } = Object.fromEntries(
        formData.entries()
      );
      const response = await fetchApi(`/api/setting?table_name=${table_name}`, {
        method: "PATCH",
        body: JSON.stringify({ id, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating buffet table:", error);
      return null;
    }
  },
  async addTable(prevState: any, formData: FormData) {
    try {
      const { table_name, ...data } = Object.fromEntries(formData.entries());
      let payload = data;
      if (table_name === "other_info") {
        for (const [key, value] of Object.entries(payload)) {
          console.log(key, value);
          payload = { name: key, value };
        }
      }
      console.log("Payload to be sent:", payload);
      const response = await fetchApi(`/api/setting?table_name=${table_name}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding buffet table:", error);
      return null;
    }
  },
};

export default settingAction;
