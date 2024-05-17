import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const checkSubscription = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }

  /*const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));*/

  const { data: _userSubscriptions, error } = await db
    .from('userSubscriptions')
    .select('*')
    .eq('userId', userId);

  /*if (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Error fetching chats' }, { status: 500 });
  }*/

  if (!_userSubscriptions) {
    return false;
  }

  const userSubscription = _userSubscriptions[0];

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
    Date.now();

  return !!isValid;
};
