"use client";

import { useEffect, useState } from "react";

type StyleResult = {
  style: string;
  label: string;
  images: string[];
};

export default function ResultsPage() {
  const [results, setResults] = useState<StyleResult[] | null>(null);

  useEffect(() => {
    // 1. Create 60 high-quality mock portraits grouped into 4 distinct styles
    const photoIds = [
      '1534528741775-53994a69daeb', 
      '1507003211169-0a1dd7228f2d', 
      '1494790108377-be9c29b29330', 
      '1500648767791-00dcc994a43e'
    ];

    const generateImagesForStyle = (startIdx: number) => {
      return Array.from({ length: 15 }, (_, i) => {
        const idx = startIdx + i;
        const id = photoIds[idx % photoIds.length];
        return `https://images.unsplash.com/photo-${id}?w=500&auto=format&fit=crop&q=80&sig=${idx}`;
      });
    };

    const mockGroups: StyleResult[] = [
      { style: "corporate", label: "Executive Studio", images: generateImagesForStyle(0) },
      { style: "casual", label: "Modern Casual", images: generateImagesForStyle(15) },
      { style: "outdoor", label: "Natural Outdoor", images: generateImagesForStyle(30) },
      { style: "creative", label: "Creative Editorial", images: generateImagesForStyle(45) }
    ];

    setResults(mockGroups);
  }, []);

  if (!results) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper p-4">
        <p className="text-ink/50">Loading your portrait gallery...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-12 text-ink selection:bg-ink selection:text-paper">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="font-display text-lg font-bold tracking-tight">
          Sitting
        </a>
        <h1 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Your gallery is ready.
        </h1>
        <p className="mt-2 text-ink/60">
          Download the ones that look like you.
        </p>

        <div className="mt-12 space-y-16">
          {results.map((group) => (
            <section key={group.style}>
              <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
                {group.label}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                      alt={`${group.label} portrait`}
                      className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 right-2 rounded-lg bg-paper/90 px-2 py-1 text-xs font-medium opacity-0 transition duration-200 group-hover:opacity-100 shadow-sm">
                      Download
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
