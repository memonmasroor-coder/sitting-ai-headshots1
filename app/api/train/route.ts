import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { replicate, TRAINER_MODEL } from "@/lib/replicate";

// This route accepts multiple image files, zips them in memory,
// and kicks off a LoRA training job on Replicate.
//
// NOTE: Replicate's trainer needs the zip to be reachable at a public URL.
// The simplest free-tier-friendly approach is to upload the zip to
// Replicate's own file storage via their /v1/files endpoint, which is
// what the JS client's `replicate.files.create` helper does below.

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Server is missing REPLICATE_API_TOKEN. See README.md." },
        { status: 500 }
      );
    }
         const formData = await req.formData();
    const files = formData.getAll("photos");

    if (!files || files.length < 6) {
      return NextResponse.json(
        { error: "Please upload at least 6 photos" },
        { status: 400 }
      );
    }

    // =========================================================
    // MOCK TRAINING START (Replaced Replicate token logic)
    // =========================================================
    
    // 1. Simulates a 3-second processing delay so your app's loading spinner works
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 2. Returns a fake success status to move the user to the generation screen
    return NextResponse.json({
      success: true,
      id: "mock-training-id-12345",
      status: "succeeded", 
      version: "mock_version_string"
    });
    
    // =========================================================
    // MOCK TRAINING END
    // =========================================================
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

    
    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length < 6) {
      return NextResponse.json(
        { error: "Please upload at least 6 photos for good results." },
        { status: 400 }
      );
    }
    if (files.length > 25) {
      return NextResponse.json(
        { error: "Please upload 25 photos or fewer." },
        { status: 400 }
      );
    }

    // Build a zip in memory
    const zip = new JSZip();
    let i = 0;
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "jpg";
      zip.file(`photo_${i}.${ext}`, buf);
      i++;
    }
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBytes = new Uint8Array(zipBuffer);

    // Upload the zip to Replicate's file storage so the trainer can fetch it
    const uploadedZip = await replicate.files.create(
      new Blob([zipBytes], { type: "application/zip" }) as any,
      { filename: "training-photos.zip" } as any
    );
    const zipUrl = uploadedZip.urls.get;

    // Kick off training. destination must be a model you own on Replicate,
    // e.g. "your-username/sitting-user-123". Create it first via the API
    // or dashboard — see README.md for the one-time setup script.
    const destination = process.env.REPLICATE_TRAINING_DESTINATION;
    if (!destination) {
      return NextResponse.json(
        {
          error:
            "Server is missing REPLICATE_TRAINING_DESTINATION. See README.md.",
        },
        { status: 500 }
      );
    }

    const training = await replicate.trainings.create(
      TRAINER_MODEL.split(":")[0].split("/")[0],
      TRAINER_MODEL.split(":")[0].split("/")[1],
      TRAINER_MODEL.split(":")[1],
      {
        destination: destination as `${string}/${string}`,
        input: {
          input_images: zipUrl,
          trigger_word: "TOK",
          steps: 1000,
        },
      }
    );

    return NextResponse.json({ trainingId: training.id });
  } catch (err: any) {
    console.error("Training error:", err);
    return NextResponse.json(
      { error: err.message || "Training failed to start." },
      { status: 500 }
    );
  }
}
