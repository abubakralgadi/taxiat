import { describe, expect, it, vi } from "vitest";
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

  it("requests compressed JPEG output for hosted image edits", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    const originalModel = process.env.OPENAI_IMAGE_MODEL;
    const originalFetch = globalThis.fetch;
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_IMAGE_MODEL = "gpt-image-2.5-sunburst";

    let sentForm: FormData | undefined;
    globalThis.fetch = vi.fn(async (_url, options) => {
      sentForm = options?.body as FormData;
      return { ok: true, json: async () => ({ data: [{ b64_json: "dGVzdA==" }] }) } as Response;
    }) as typeof fetch;

    let responseBody = "";
    const response = {
      statusCode: 0,
      setHeader: () => undefined,
      end: (chunk: string) => { responseBody = chunk; },
    };
    const request = {
      file: { mimetype: "image/png", buffer: Buffer.from("test image"), originalname: "facade.png" },
      body: { width: "18", height: "9", productCode: "WPC US09", productName: "خشب دافئ", stylePrompt: "واجهة دافئة" },
    };

    try {
      await createVisualization(request as never, response as never);
      expect(sentForm?.get("output_format")).toBe("jpeg");
      expect(sentForm?.get("output_compression")).toBe("75");
      expect(JSON.parse(responseBody).imageUrl).toBe("data:image/jpeg;base64,dGVzdA==");
    } finally {
      globalThis.fetch = originalFetch;
      if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalApiKey;
      if (originalModel === undefined) delete process.env.OPENAI_IMAGE_MODEL;
      else process.env.OPENAI_IMAGE_MODEL = originalModel;
    }
  });
});
