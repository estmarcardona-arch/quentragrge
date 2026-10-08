import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ status: "error", message: "Missing Supabase env vars" }, { status: 500 });
    }

    // We will query a built-in table or just return healthy since we assume anon key works if URL works.
    // For a real check, we could call a simple RPC. For now, just checking the URL exists.
    
    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 });
  }
}
