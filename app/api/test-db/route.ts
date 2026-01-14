import { connectToDatabase } from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ 
            success: true, 
            message: "✅ Database connected successfully!",
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
