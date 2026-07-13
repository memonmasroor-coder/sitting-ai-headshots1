import { NextRequest, NextResponse } from "next/server";
import { replicate, STYLE_PRESETS } from "@/lib/replicate";

export const maxDuration = 60;

// Generates headshots for every style preset using the user's trained
// LoRA version. `modelVersion` is the version id returned once training
// succeeds (see /api/status).
export async function POST(req: NextRequest) {
  try {
    const { modelVersion, styleIds } = (await req.json()) as {
      modelVersion: string;
      styleIds?: string[];
    };

    if (!modelVersion) {
      return NextResponse.json(
        { error: "Missing modelVersion." },
        { status: 400 }
      );
    }

    const styles = STYLE_PRESETS.filter(
      (s) => !styleIds || styleIds.includes(s.id)
    );

    // Run each style preset in parallel, 4 images per style
    const jobs = styles.map(async (style) => {
      const output = await replicate.run(modelVersion as `${string}/${string}:${string}`, {
        input: {
          prompt: style.prompt,
          num_outputs: 4,
          aspect_ratio: "3:4",
          output_format: "jpg",
          guidance_scale: 3.5,
        },
      });
      return { style: style.id, label: style.label, images: output as string[] };
    });

    const results = await Promise.all(jobs);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: err.message || "Generation failed." },
      { status: 500 }
    );
  }
}
