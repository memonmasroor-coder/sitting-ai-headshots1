"use client";

import { useEffect, useState } from "react";

type StyleResult = { style: string; label: string; images: string[] };

export default function ResultsPage() {
  const [results, setResults] = useState<StyleResult[] | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("sitting-results");
    if (raw) setResults(JSON.parse(raw));
  }, []);

  if (!results) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper text-ink">
        <p className="text-ink/50">
          No gallery found. Start a{" "}
          <a href="/upload" className="underline">
            new sitting
          </a>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink md:px-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="font-display text-lg italic">
          Sitting
        </a>
        <h1 className="mt-8 font-display text-3xl italic md:text-4xl">
          Your gallery is ready.
        </h1>
        <p className="mt-2 text-ink/60">
          Download the ones that look like you on your best day.
        </p>

        {results.map((group) => (
          <section key={group.style} className="mt-12">
            <h2 className="mb-4 font-display text-xl italic text-ink/80">
              {group.label}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {group.images.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl bg-ink/5"
                >
                  <img
                    src={src}
                    alt={`${group.label} portrait ${i + 1}`}
                    className="aspect-[3/4] w-full object-cover transition group-hover:opacity-90"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper opacity-0 transition group-hover:opacity-100">
                    Download
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
