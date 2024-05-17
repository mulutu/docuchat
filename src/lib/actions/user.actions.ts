import { db } from "@/lib/db";
import { users } from '@/lib/db/schema'
import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";
import { handleError } from "../utils";
import { CreateUserParams } from "@/app/types";

/**
 * GetUserById
 * @param userId 
 * @returns 
 */
export async function getUserById(userId: string | any) {
    try {
        const user = await db.select().from(users).where(eq(users.userId, userId));       

        if (!user || user === null ) {
            console.log(" NO USER FOUND")
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return JSON.parse(JSON.stringify(user));
        //return NextResponse.json( { status: 200 });

    } catch (error) {
        console.error("Error fetching user details:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

// CREATE
export async function createUser( user: CreateUserParams) {
    try {  
      const newUser = await db.insert(users).values({
        userId: user?.userId,
        clerkId: user.clerkId as string,
        email: user.email,
        password: "password",
        //username: "user?.username as string",
        firstName: user.firstName,
        lastName: user.lastName,
        //photo: "user?.photo as string",
        createdAt: new Date(),
      });
  
      return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
      handleError(error);
    }
  }