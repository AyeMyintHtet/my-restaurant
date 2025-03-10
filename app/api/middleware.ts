import { getUser } from "@/utils/getUser";
import { NextApiRequest, NextApiResponse } from "next";

// Middleware function
function apiMiddleware(asyncFn: () => Promise<any>) {
  return async function (): Promise<any>{
    const user = getUser()
    if (!user) {
      return 'Unauthenticated user';
    }
    return await asyncFn();
  };
};
// function apiMiddleware<T>(asyncFn: () => Promise<T>) {
//   return async function (): Promise<T> {
//     return await asyncFn();
//   };
// }

export default apiMiddleware;


