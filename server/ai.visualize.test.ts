import { describe, expect, it } from "vitest";
import { buildArchitecturalPrompt } from "./aiPrompt";
import { createVisualization } from "./visualize";

describe("architectural visualization prompt", () => {
  it("includes the selected material, dimensions, and natural-language style", () => {
    const prompt = buildArchitecturalPrompt({
      width: "18",
      height: "9",
      productCode: "WPC US09",
      productName: "خشب دافئ",
      stylePrompt: "واجهة دافئة بخطوط عمودية وإضاءة مخفية",
    });

    expect(prompt).toContain("WPC US09");
    expect(prompt).toContain("عرض 18 متر في ارتفاع 9 متر");
    expect(prompt).toContain("واجهة دافئة بخطوط عمودية وإضاءة مخفية");
    expect(prompt).toContain("الحفاظ على كتلة المبنى");
  });

  it("returns JSON when served by Vite's Node middleware", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    let responseBody = "";
    const response = {
      statusCode: 0,
      setHeader: () => undefined,
      end: (chunk: string) => {
        responseBody = chunk;
      },
    };
    const request = {
      file: {
        mimetype: "image/png",
        buffer: Buffer.from("test image"),
        originalname: "facade.png",
      },
      body: {
        width: "18",
        height: "9",
        productCode: "WPC US09",
        productName: "خشب دافئ",
        stylePrompt: "واجهة دافئة",
      },
    };

    try {
      await createVisualization(request as never, response as never);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(responseBody)).toMatchObject({ success: true, isSimulation: true });
    } finally {
      if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalApiKey;
    }
  });
});
