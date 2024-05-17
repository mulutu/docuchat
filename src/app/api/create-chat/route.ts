import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    console.log("FILE KEY:::: " + file_key, "FILE NAME:::::  " + file_name);
    
    await loadS3IntoPinecone(file_key);

    const pdfUrl  = getS3Url(file_key);

    const { data:chat_id, error } = await db
      .from('chats')
      .insert({ pdf_name: file_name, pdf_url: pdfUrl, created_at: new Date, user_id: userId, file_key: file_key })
      .select('id')
      .single();
    
    console.log("CREATE CHAT INSERT ::: ====>" + chat_id, error)

    if(error){
      return NextResponse.json({ error: "Error during insert with error ==> " + error }, { status: 404 } );
    }

    return NextResponse.json(
      {
        chat_id: chat_id.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
