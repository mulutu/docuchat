import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  const { data: _messages, error } = await db
    .from('messages')
    .select('*')
    .eq('chat_id', chatId);

    if( error){
      return NextResponse.json( { error: error }, { status : 404 });
    }

    console.log("GET MESSAGES :: ===================>" + JSON.stringify(_messages) )

  return NextResponse.json(_messages);
};
