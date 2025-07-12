import { use } from "react";
import { PocketbaseContext } from "../context/pocketbaseContext";

export function usePocketbase() {
  const pb = use(PocketbaseContext);

  return {
    pb,
    login: (email: string, password: string) =>
      pb.collection("users").authWithPassword(email, password),
  };
}
