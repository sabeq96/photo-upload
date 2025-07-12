import PocketBase from "pocketbase";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { getCookie } from "hono/cookie";

type Variables = {
  pb: PocketBase;
};

const app = new Hono<{ Variables: Variables }>();

app.use(cors());

// Auth and create PB
app.all("/api/*", async (c, next) => {
  const pocketbaseCookie = getCookie(c, "pb_auth") || "";
  const pb = new PocketBase("http://localhost:8090");
  pb.authStore.loadFromCookie(pocketbaseCookie);

  try {
    if (!pb.authStore.isValid) throw new Error("Invalid auth store");

    c.set("pb", pb);

    pb.collection("user").authRefresh();
  } catch (error) {
    throw new Error("Authentication failed: " + error);
  }

  return next();
});

app.get("/api/server", async (c) => {
  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true,
  };

  return c.json(data, { status: 200 });
});

export default app;
