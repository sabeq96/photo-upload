import PocketBase from "pocketbase";
import { createContext, useContext, type ReactNode } from "react";
import type { TypedPocketBase } from "../types/pb";
const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase;

export const PocketBaseContext = createContext(pb);

export function PocketBaseProvider({ children }: { children: ReactNode }) {
  return <PocketBaseContext value={pb}> {children} </PocketBaseContext>;
}

export function usePocketBase() {
  return useContext(PocketBaseContext);
}
