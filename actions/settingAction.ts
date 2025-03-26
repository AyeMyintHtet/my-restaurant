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
  async deleteTable(table_name: IDatabases, id: number) {
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
      console.log("id", id);
      console.log("props", updates);
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
      console.log(data);
      const response = await fetchApi(`/api/setting?table_name=${table_name}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log(response);
      return await response.json();
    } catch (error) {
      console.error("Error adding buffet table:", error);
      return null;
    }
  },
};

export default settingAction;
