import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export async function GET(req: NextRequest) {
  const trainingId = req.nextUrl.searchParams.get("trainingId");
  if (!trainingId) {
    return NextResponse.json({ error: "Missing trainingId" }, { status: 400 });
  }

  try {
    const training = await replicate.trainings.get(trainingId);
    return NextResponse.json({
      status: training.status, // starting | processing | succeeded | failed | canceled
      version: training.output?.version ?? null,
      error: training.error ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not fetch status." },
      { status: 500 }
    );
  }
}
