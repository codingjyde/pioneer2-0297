import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./database";
import {
  cityRecommendations,
  contacts,
  partners,
  pioneerApplications,
  subscribers,
} from "./database/schema";

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .get("/ping", (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .post("/subscribe", async (c) => {
    const body = await c.req.json<{ email?: string }>().catch(() => ({}) as { email?: string });
    const email = (body.email ?? "").trim();
    if (!email || !email.includes("@")) {
      return c.json({ error: "A valid email is required." }, 400);
    }
    const [row] = await db.insert(subscribers).values({ email }).returning();
    return c.json({ ok: true, subscriber: row }, 201);
  })
  .post("/pioneer", async (c) => {
    const body = await c.req.json<{
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      role?: string;
      rhemaGraduate?: boolean;
      targetRegion?: string;
      message?: string;
    }>().catch(() => ({}));
    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const role = (body.role ?? "").trim();
    if (!fullName || !email.includes("@") || !role) {
      return c.json({ error: "Name, a valid email, and a role are required." }, 400);
    }
    const [row] = await db
      .insert(pioneerApplications)
      .values({
        fullName,
        email,
        phone: body.phone?.trim() || null,
        location: body.location?.trim() || null,
        role,
        rhemaGraduate: Boolean(body.rhemaGraduate),
        targetRegion: body.targetRegion?.trim() || null,
        message: body.message?.trim() || null,
      })
      .returning();
    return c.json({ ok: true, application: row }, 201);
  })
  .post("/partner", async (c) => {
    const body = await c.req.json<{
      fullName?: string;
      email?: string;
      phone?: string;
      partnershipType?: string;
      amount?: string;
      message?: string;
    }>().catch(() => ({}));
    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const partnershipType = (body.partnershipType ?? "").trim();
    if (!fullName || !email.includes("@") || !partnershipType) {
      return c.json({ error: "Name, a valid email, and a partnership type are required." }, 400);
    }
    const [row] = await db
      .insert(partners)
      .values({
        fullName,
        email,
        phone: body.phone?.trim() || null,
        partnershipType,
        amount: body.amount?.trim() || null,
        message: body.message?.trim() || null,
      })
      .returning();
    return c.json({ ok: true, partner: row }, 201);
  })
  .post("/contact", async (c) => {
    const body = await c.req.json<{
      fullName?: string;
      email?: string;
      subject?: string;
      message?: string;
    }>().catch(() => ({}));
    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();
    if (!fullName || !email.includes("@") || !message) {
      return c.json({ error: "Name, a valid email, and a message are required." }, 400);
    }
    const [row] = await db
      .insert(contacts)
      .values({
        fullName,
        email,
        subject: body.subject?.trim() || null,
        message,
      })
      .returning();
    return c.json({ ok: true, contact: row }, 201);
  })
  .post("/recommend-city", async (c) => {
    const body = await c.req.json<{
      recommenderName?: string;
      email?: string;
      cityName?: string;
      country?: string;
      state?: string;
      reason?: string;
      contactPerson?: string;
    }>().catch(() => ({}));
    const recommenderName = (body.recommenderName ?? "").trim();
    const cityName = (body.cityName ?? "").trim();
    if (!recommenderName || !cityName) {
      return c.json({ error: "Your name and a city are required." }, 400);
    }
    const [row] = await db
      .insert(cityRecommendations)
      .values({
        recommenderName,
        email: body.email?.trim() || null,
        cityName,
        country: body.country?.trim() || null,
        state: body.state?.trim() || null,
        reason: body.reason?.trim() || null,
        contactPerson: body.contactPerson?.trim() || null,
      })
      .returning();
    return c.json({ ok: true, recommendation: row }, 201);
  });

export type AppType = typeof app;
export default app;
