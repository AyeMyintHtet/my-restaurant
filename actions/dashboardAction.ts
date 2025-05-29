import { fetchApi } from "@/lib/api"; // Adjust import path if necessary
import { customerTable } from "@/types/supabase_db.types";

const dashboardAction = {
  async getDashboardTableInfo(): Promise<customerTable[]> {
    try {
      const response = await fetchApi(`/api/dashboard`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching buffet tables:", error);
      return [];
    }
  },
  async addDashboardTableInfo(prevState: any, formData: FormData) {
    try {
      const data = Object.fromEntries(formData.entries());
      console.log(data, "data");
      const obj = {
        ...data,
        created_at: new Date(),
        paid: false,
      };
      console.log(obj, "obj");

      const response = await fetchApi(`/api/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json()
      return { message: "success", data: {...res,from:'create'}};
    } catch (error) {
      console.error("Error adding buffet table:", error);
      return { error: "Something went wrong", hint: "Something went wrong" };
    }
  },
  async updateDashboardTableInfo(prevState: any, formData: FormData) {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchApi(`/api/dashboard`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return { message: "success", data: await response.json() };
    } catch (error) {
      console.error("Error updating buffet table:", error);
      return { error: "Something went wrong", hint: "Something went wrong" };
    }
  },
  async changePaidStatusTable(id:number){
    try {
      const response = await fetchApi(`/api/dashboard`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id, paid: true }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return { message: "success", data: await response.json() };
    } catch (error) {
      console.error("Error updating buffet table:", error);
      return { error: "Something went wrong", hint: "Something went wrong" };
    }
  }
};

export default dashboardAction;
