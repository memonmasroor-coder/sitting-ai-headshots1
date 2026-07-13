import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn(
    "REPLICATE_API_TOKEN is not set. Add it to .env.local — see README.md"
  );
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// The base model we fine-tune a LoRA on top of.
// See: https://replicate.com/ostris/flux-dev-lora-trainer
export const TRAINER_MODEL =
  "ostris/flux-dev-lora-trainer:e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497";

// The generation model that applies a trained LoRA to a prompt.
export const GENERATION_MODEL =
  "black-forest-labs/flux-dev-lora";

export const STYLE_PRESETS = [
  {
    id: "corporate",
    label: "Corporate",
    prompt:
      "professional corporate headshot of TOK, wearing a tailored navy blazer, neutral grey studio background, soft key light, sharp focus, shot on a Canon EOS R5, 85mm lens",
  },
  {
    id: "editorial",
    label: "Editorial",
    prompt:
      "editorial portrait of TOK, natural window light, minimal dark background, relaxed confident expression, shot on Kodak Portra 400, shallow depth of field",
  },
  {
    id: "outdoor",
    label: "Outdoor",
    prompt:
      "outdoor environmental portrait of TOK, golden hour lighting, soft bokeh city background, warm tones, candid professional look",
  },
  {
    id: "casual",
    label: "Casual",
    prompt:
      "casual professional portrait of TOK, wearing a crew-neck sweater, plain light backdrop, warm approachable smile, soft even lighting",
  },
] as const;

export type StylePresetId = (typeof STYLE_PRESETS)[number]["id"];
