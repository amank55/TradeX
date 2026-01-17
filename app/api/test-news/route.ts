import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await inngest.send({ name: 'app/send.daily.news', data: {} });
    return NextResponse.json({ message: 'News email triggered successfully' });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}