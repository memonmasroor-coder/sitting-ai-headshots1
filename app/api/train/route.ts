import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("photos");

    if (!files || files.length < 6) {
      return NextResponse.json(
        { error: "Please upload at least 6 photos" },
        { status: 400 }
      );
    }

    // Simulate training delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json({
      success: true,
      id: "mock-training-id-12345",
      status: "succeeded", 
      version: "mock_version_string"
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
