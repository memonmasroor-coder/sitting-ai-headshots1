import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export async function GET(req: NextRequest) {
  const trainingId = req.nextUrl.searchParams.get("trainingId");
  if (!trainingId) {
    return NextResponse.json({ error: "Missing trainingId" }, { status: 400 });
  }

  try {
    // =========================================================
    // MOCK STATUS START (Forces a successful state for free testing)
    // =========================================================
    return NextResponse.json({
      status: "succeeded", 
      version: "mock_version_string",
      error: null
    });
    // =========================================================
    // MOCK STATUS END
    // =========================================================
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not fetch status" },
      { status: 500 }
    );
  }
}
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not fetch status." },
      { status: 500 }
    );
  }
}
