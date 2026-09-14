import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function isAdmin(){
  const store = await cookies();
  return verifyToken(store.get("shotech_admin")?.value);
}
