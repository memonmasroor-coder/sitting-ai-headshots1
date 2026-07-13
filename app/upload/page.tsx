"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Phase = "collecting" | "uploading" | "training" | "generating" | "error";

const MIN_PHOTOS = 6;
const MAX_PHOTOS = 25;
const MAX_DIMENSION = 1600; // px, longest side
const JPEG_QUALITY = 0.82;

// Resizes/compresses an image file in the browser before upload, so large
// phone-camera photos (often 3-10MB each) don't blow past serverless
// request size limits when several are sent together.
async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file; // fall back to original if canvas unsupported
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>("collecting");
  const [errorMsg, setErrorMsg] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => {
      const combined = [...prev, ...Array.from(incoming)];
      return combined.slice(0, MAX_PHOTOS);
    });
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const startSitting = async () => {
    setErrorMsg("");
    setPhase("uploading");
    try {
      setProgressNote("Preparing your photos...");
      const compressed = await Promise.all(files.map(compressImage));

      const formData = new FormData();
      compressed.forEach((f) => formData.append("photos", f));

      const trainRes = await fetch("/api/train", {
        method: "POST",
        body: formData,
      });

      let trainData: any;
      const rawText = await trainRes.text();
      try {
        trainData = JSON.parse(rawText);
      } catch {
        throw new Error(
          trainRes.status === 413
            ? "Your photos were too large even after compression. Try uploading fewer at once."
            : `Server error (${trainRes.status}). Please try again in a moment.`
        );
      }
      if (!trainRes.ok) throw new Error(trainData.error || "Upload failed.");

      setPhase("training");
      setProgressNote("Studying your photos — this usually takes 15–25 minutes.");

      const modelVersion = await pollTraining(trainData.trainingId);

      setPhase("generating");
      setProgressNote("Composing your gallery...");

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelVersion }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Generation failed.");

      sessionStorage.setItem("sitting-results", JSON.stringify(genData.results));
      router.push("/results");
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const pollTraining = (trainingId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/status?trainingId=${trainingId}`);
          const data = await res.json();
          if (data.status === "succeeded") {
            clearInterval(interval);
            resolve(data.version);
          } else if (data.status === "failed" || data.status === "canceled") {
            clearInterval(interval);
            reject(new Error(data.error || "Training failed."));
          }
        } catch (e) {
          clearInterval(interval);
          reject(e);
        }
      }, 15000); // poll every 15s
    });
  };

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink md:px-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="font-display text-lg italic">
          Sitting
        </a>

        {phase === "collecting" && (
          <>
            <h1 className="mt-8 font-display text-3xl italic leading-tight md:text-4xl">
              Bring a dozen photos of yourself.
            </h1>
            <p className="mt-3 text-ink/65">
              Different angles, different lighting, different days if you
              have them. Avoid sunglasses and group shots. {MIN_PHOTOS}–
              {MAX_PHOTOS} photos works best.
            </p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-white/40 px-6 py-16 text-center transition hover:border-brass"
            >
              <p className="font-display text-lg italic text-ink/70">
                Drop photos here, or click to browse
              </p>
              <p className="mt-1 text-sm text-ink/40">JPG or PNG</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {files.map((file, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs text-paper opacity-0 transition group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-ink/50">
                {files.length} / {MIN_PHOTOS} minimum
              </p>
              <button
                disabled={files.length < MIN_PHOTOS}
                onClick={startSitting}
                className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition disabled:cursor-not-allowed disabled:bg-ink/20 hover:enabled:bg-clay"
              >
                Begin sitting
              </button>
            </div>
          </>
        )}

        {(phase === "uploading" || phase === "training" || phase === "generating") && (
          <div className="mt-24 flex flex-col items-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-clay" />
            <h2 className="mt-6 font-display text-2xl italic">
              {phase === "uploading" && "Sending your photos..."}
              {phase === "training" && "In the studio..."}
              {phase === "generating" && "Composing your gallery..."}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink/55">{progressNote}</p>
          </div>
        )}

        {phase === "error" && (
          <div className="mt-16 rounded-xl border border-clay/30 bg-clay/5 p-6">
            <h2 className="font-display text-xl italic text-clay">
              That didn't go through.
            </h2>
            <p className="mt-2 text-sm text-ink/70">{errorMsg}</p>
            <button
              onClick={() => setPhase("collecting")}
              className="mt-4 rounded-full border border-ink/20 px-5 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
