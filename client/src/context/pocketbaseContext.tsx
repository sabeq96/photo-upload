import { createContext } from "react";
import PocketBase from "pocketbase";
import { APP_SETTINGS } from "../misc/consts";

const pocketbaseInstance = new PocketBase(APP_SETTINGS.pocketbaseUrl);

export const PocketbaseContext = createContext(pocketbaseInstance);

export function PocketbaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PocketbaseContext.Provider value={pocketbaseInstance}>
      {children}
    </PocketbaseContext.Provider>
  );
}
