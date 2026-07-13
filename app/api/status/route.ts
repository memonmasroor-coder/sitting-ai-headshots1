import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const trainingId = req.nextUrl.searchParams.get("trainingId");
  if (!trainingId) {
    return NextResponse.json({ error: "Missing trainingId" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      status: "succeeded", 
      version: "mock_version_string",
      error: null
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not fetch status" },
      { status: 500 }
    );
  }
}
