import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";


// supabaseModels.ts
export interface Chat {
  id: number;
  pdf_name: string;
  pdf_url: string;
  created_at: Date;
  user_id: string;
  file_key: string;
}


export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdf_name: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  fileKey: text("file_key").notNull(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const users = pgTable("users", {
  userId: text("user_id").primaryKey().notNull(),
  clerkId: text("clerk_id").notNull(),
  email: text("name").unique().notNull(),
  password: text("password"), // Hashed password
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export type DrizzleUser = typeof users.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
});

// drizzle-orm
// drizzle-kit


//export type InsertUser = typeof usersTable.$inferInsert;
//export type SelectUser = typeof usersTable.$inferSelect;

//export type InsertPost = typeof postsTable.$inferInsert;
//export type SelectPost = typeof postsTable.$inferSelect;
