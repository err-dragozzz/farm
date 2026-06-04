export type AiIntent = "crop-recommendation" | "disease-detection" | "yield-prediction" | "expense-optimization" | "insights";

export function agricultureInsight(intent: AiIntent, input: Record<string, unknown>) {
  const crop = String(input.crop ?? "current crop");
  const soil = String(input.soilType ?? "available soil");
  const location = String(input.location ?? "your farm");

  const playbooks: Record<AiIntent, { title: string; bullets: string[] }> = {
    "crop-recommendation": {
      title: "Crop recommendation",
      bullets: [
        `Prioritize high-margin crops suited to ${soil} and the weather pattern around ${location}.`,
        "Rotate legumes after heavy-feeding crops to improve nitrogen and reduce fertilizer spend.",
        "Use farm history, market price, and water availability before committing acreage."
      ]
    },
    "disease-detection": {
      title: "Disease triage",
      bullets: [
        `Inspect ${crop} leaves for spread pattern, underside lesions, and stem discoloration.`,
        "Isolate affected plants, photograph symptoms, and avoid overhead irrigation until confirmed.",
        "Connect an image model provider in this endpoint for automated diagnosis scoring."
      ]
    },
    "yield-prediction": {
      title: "Yield prediction",
      bullets: [
        `Expected yield for ${crop} should combine acreage, crop age, rainfall, input quality, and past farm output.`,
        "Current records show the largest forecast risk comes from missing actual yield and weather readings.",
        "Update harvest checkpoints weekly for tighter prediction confidence."
      ]
    },
    "expense-optimization": {
      title: "Expense optimization",
      bullets: [
        "Compare recurring fertilizer, labor, and diesel expenses against revenue per acre.",
        "Bundle vendor orders and shift non-urgent machinery work away from peak-rate windows.",
        "Flag expense categories above 35% of projected revenue for manager review."
      ]
    },
    insights: {
      title: "Smart farming insights",
      bullets: [
        "Net profit improves fastest when sale price tracking and pending payment follow-up are enforced.",
        "Create reminders around irrigation, fertilizer, and harvest windows to reduce preventable losses.",
        "Weather, bill images, and actual yield data will make the AI layer materially more useful."
      ]
    }
  };

  return {
    intent,
    generatedAt: new Date().toISOString(),
    ...playbooks[intent],
    provider: process.env.OPENAI_API_KEY ? "ready-for-openai" : "rules-engine"
  };
}
