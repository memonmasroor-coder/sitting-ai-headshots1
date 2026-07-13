import Link from "next/link";

const steps = [
  {
    label: "Upload",
    body: "A dozen photos from your camera roll. Different angles, different light. No studio, no appointment.",
  },
  {
    label: "Sit",
    body: "Our model studies your face for about twenty minutes — the way a portrait painter would study a subject before the first stroke.",
  },
  {
    label: "Collect",
    body: "A full contact sheet arrives in your inbox. Business, editorial, outdoor. Pick the ones that look like you, on your best day.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <span className="font-display text-xl italic tracking-tight">
          Sitting
        </span>
        <Link
          href="/upload"
          className="rounded-full border border-ink/15 px-5 py-2 text-sm font-medium transition hover:border-ink/40"
        >
          Start your sitting
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pt-10 pb-20 md:px-12 md:pt-16 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 font-body text-sm uppercase tracking-[0.2em] text-brass">
            A photo studio, without the studio
          </p>
          <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-tight md:text-[4.5rem]">
            The portrait you'd get if you actually{" "}
            <span className="italic text-clay">had the afternoon.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
            Most headshots look like what they are: fifteen rushed minutes
            with a stranger and a softbox. Ours are trained on dozens of your
            own photos, so the outcome looks like you, dressed for the
            occasion — not like a filter.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/upload"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-clay"
            >
              Book your sitting — $29
            </Link>
            <span className="text-sm text-ink/50">
              100+ portraits · ready in under an hour
            </span>
          </div>
        </div>
      </section>

      {/* Process — a real sequence, so numbering is earned */}
      <section className="border-t border-ink/10 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 font-display text-2xl italic text-ink/80">
            How a sitting works
          </h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <div key={step.label} className="relative">
                <span className="font-display text-5xl text-ink/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl italic">
                  {step.label}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/65">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof / trust strip */}
      <section className="border-t border-ink/10 bg-ink px-6 py-16 text-paper md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md font-display text-2xl italic leading-snug">
            "Sat for it on a Sunday morning. Uploaded my profile picture on a
            Sunday afternoon."
          </p>
          <div className="flex gap-10 text-sm text-paper/60">
            <div>
              <p className="font-display text-3xl text-paper">100+</p>
              <p>portraits per sitting</p>
            </div>
            <div>
              <p className="font-display text-3xl text-paper">&lt; 1hr</p>
              <p>from upload to gallery</p>
            </div>
            <div>
              <p className="font-display text-3xl text-paper">$29</p>
              <p>flat, no subscription</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="px-6 py-24 text-center md:px-12">
        <h2 className="mx-auto max-w-xl font-display text-3xl italic leading-tight">
          Your next profile picture is a dozen selfies away.
        </h2>
        <Link
          href="/upload"
          className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-clay"
        >
          Book your sitting
        </Link>
      </section>

      <footer className="border-t border-ink/10 px-6 py-8 text-center text-xs text-ink/40 md:px-12">
        Sitting — an AI portrait studio. Photos are used only to generate
        your gallery and are deleted afterward.
      </footer>
    </main>
  );
}
