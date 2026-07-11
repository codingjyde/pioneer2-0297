import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
};

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  ...timestamps,
});

export const pioneerApplications = sqliteTable("pioneer_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  // "go" | "support" | "strengthen" | "supply"
  role: text("role").notNull(),
  rhemaGraduate: integer("rhema_graduate", { mode: "boolean" }).notNull().default(false),
  targetRegion: text("target_region"),
  message: text("message"),
  ...timestamps,
});

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  // "monthly" | "one-off" | "prayer" | "church"
  partnershipType: text("partnership_type").notNull(),
  amount: text("amount"),
  message: text("message"),
  ...timestamps,
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  ...timestamps,
});

export const cityRecommendations = sqliteTable("city_recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recommenderName: text("recommender_name").notNull(),
  email: text("email"),
  cityName: text("city_name").notNull(),
  country: text("country"),
  state: text("state"),
  reason: text("reason"),
  contactPerson: text("contact_person"),
  ...timestamps,
});
