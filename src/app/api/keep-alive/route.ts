import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/**
 * GET /api/keep-alive
 *
 * A lightweight ping endpoint that keeps the Supabase database active
 * by making a minimal query. This prevents the free-tier database from
 * being auto-paused by Supabase after 7 days of inactivity.
 *
 * Called by the GitHub Actions cron job every 3 days.
 * Protected by a secret token to prevent abuse.
 */
export async function GET(request: Request) {
  // Validate the secret token to prevent unauthorized pings
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const expectedToken = process.env.KEEP_ALIVE_SECRET;

  if (!expectedToken) {
    console.warn(
      "[keep-alive] KEEP_ALIVE_SECRET is not set. Running without auth protection."
    );
  }

  if (expectedToken && token !== expectedToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    const supabase = await createSupabaseServerClient();

    // Lightweight ping: just check the server is reachable
    const { error } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.log(
        "[keep-alive] Supabase responded (table query returned error but DB is alive):",
        error.message
      );
    }

    const latencyMs = Date.now() - startTime;

    console.log(
      `[keep-alive] SUCCESS Supabase is alive. Latency: ${latencyMs}ms — ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      message: "Supabase is alive and active",
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    console.error("[keep-alive] FAILED Supabase ping failed:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Supabase ping failed",
        details: err instanceof Error ? err.message : String(err),
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
