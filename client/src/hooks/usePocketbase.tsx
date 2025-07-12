import { use, useEffect, useState } from "react";
import { PocketbaseContext } from "../context/pocketbaseContext";

type Me = {
  avatar: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  verified: boolean;
};

export function usePocketbase() {
  const pb = use(PocketbaseContext);
  const [me, setMe] = useState<Me | null>(null);

  async function handleLogin(email: string, password: string) {
    const auth = await pb
      .collection("users")
      .authWithPassword<Me>(email, password);
    setMe(auth.record);
  }

  useEffect(() => {
    (async () => {
      if (!pb.authStore.isValid || me) {
        return;
      }

      const auth = await pb.collection("users").authRefresh<Me>();

      setMe(auth.record);
    })();
  }, [pb.authStore.isValid, me, pb]);

  return {
    pb,
    me,
    login: handleLogin,
  };
}
