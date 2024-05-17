import { pgTable, pgEnum, serial, text, timestamp, varchar, foreignKey, integer, unique } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"
export const userSystemEnum = pgEnum("user_system_enum", ['user', 'system'])


export const chats = pgTable("chats", {
	id: serial("id").primaryKey().notNull(),
	pdfName: text("pdf_name").notNull(),
	pdfUrl: text("pdf_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	fileKey: text("file_key").notNull(),
});

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	chatId: integer("chat_id").notNull().references(() => chats.id),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	role: userSystemEnum("role").notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
	id: serial("id").primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).notNull(),
	stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
	stripePriceId: varchar("stripe_price_id", { length: 256 }),
	stripeCurrentPeriodEndedAt: timestamp("stripe_current_period_ended_at", { mode: 'string' }),
},
(table) => {
	return {
		userSubscriptionsUserIdUnique: unique("user_subscriptions_user_id_unique").on(table.userId),
		userSubscriptionsStripeCustomerIdUnique: unique("user_subscriptions_stripe_customer_id_unique").on(table.stripeCustomerId),
		userSubscriptionsStripeSubscriptionIdUnique: unique("user_subscriptions_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
	}
});

export const users = pgTable("users", {
	userId: varchar("user_id", { length: 256 }).primaryKey().notNull(),
	clerkId: text("clerk_id").notNull(),
	name: text("name").notNull(),
	password: text("password").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usersNameUnique: unique("users_name_unique").on(table.name),
	}
});