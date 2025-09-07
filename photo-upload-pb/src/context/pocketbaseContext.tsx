import PocketBase from "pocketbase";
import { createContext, useContext, type ReactNode } from "react";
import type { TypedPocketBase } from "../types/pb";
import { POCKETBASE_URL } from "../consts";
const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;

export const PocketBaseContext = createContext(pb);

export function PocketBaseProvider({ children }: { children: ReactNode }) {
  return <PocketBaseContext value={pb}> {children} </PocketBaseContext>;
}

export function usePocketBase() {
  return useContext(PocketBaseContext);
}
