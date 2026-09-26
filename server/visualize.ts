import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { buildArchitecturalPrompt } from "./aiPrompt";

// Load .env automatically if available
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
} catch {
  // Ignore error if env loading fails
}

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    callback(null, allowedMimeTypes.has(file.mimetype));
  },
});

function asText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function clampText(value: unknown, maxLength: number) {
  return asText(value).slice(0, maxLength);
}

// Vite's development middleware exposes Node's ServerResponse, while the
// production server exposes Express's Response. Use the shared Node response
// methods so this handler works in both environments.
function sendJson(response: Response, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

export async function createVisualization(request: Request, response: Response) {
  const image = request.file;
  if (!image) {
    return sendJson(response, 400, { error: "أضف صورة واجهة بصيغة JPG أو PNG أو WebP.", code: "IMAGE_REQUIRED" });
  }
  if (!allowedMimeTypes.has(image.mimetype)) {
    return sendJson(response, 415, { error: "صيغة الصورة غير مدعومة.", code: "UNSUPPORTED_IMAGE_TYPE" });
  }

  const width = clampText(request.body.width, 12);
  const height = clampText(request.body.height, 12);
  const productCode = clampText(request.body.productCode, 40);
  const productName = clampText(request.body.productName, 80);
  const stylePrompt = clampText(request.body.stylePrompt, 300);

  if (!Number(width) || !Number(height) || Number(width) <= 0 || Number(height) <= 0) {
    return sendJson(response, 400, { error: "أدخل مقاسات صحيحة أكبر من صفر.", code: "INVALID_DIMENSIONS" });
  }
  if (!productCode || !productName) {
    return sendJson(response, 400, { error: "اختر خامة قبل إنشاء التصور.", code: "PRODUCT_REQUIRED" });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst";
  const imageSize = process.env.OPENAI_IMAGE_SIZE || "1536x1024";
  const imageQuality = process.env.OPENAI_IMAGE_QUALITY || "medium";

  // If no OpenAI API Key is provided, return a simulation preview so the app remains fully functional.
  if (!apiKey) {
    const base64Original = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    return sendJson(response, 200, {
      success: true,
      imageUrl: base64Original,
      model: "محاكاة معمارية تجريبية",
      isSimulation: true,
      note: "تمت المعاينة بنجاح. أضف OPENAI_API_KEY في ملف .env لتفعيل التوليد المباشر بالذكاء الاصطناعي عبر OpenAI.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const prompt = buildArchitecturalPrompt({ width, height, productCode, productName, stylePrompt });

    // DALL·E models generate from text; GPT Image models edit the uploaded facade.
    if (model.startsWith("dall-e")) {
      const openaiResponse = await fetch(`${baseUrl}/images/generations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size: "1024x1024",
          quality: imageQuality,
          response_format: "b64_json",
        }),
        signal: controller.signal,
      });

      const payload = await openaiResponse.json() as {
        data?: Array<{ b64_json?: string; url?: string }>;
        error?: { message?: string; type?: string };
      };

      if (!openaiResponse.ok) {
        console.error("OpenAI image API error:", openaiResponse.status, payload.error?.message);
        return sendJson(response, 502, {
          error: payload.error?.message || "تعذر إنشاء التصور من OpenAI. تحقق من صلاحية المفتاح ورصيد الحساب.",
          code: "IMAGE_PROVIDER_ERROR",
        });
      }

      const b64 = payload.data?.[0]?.b64_json;
      const url = payload.data?.[0]?.url;

      if (!b64 && !url) {
        return sendJson(response, 502, { error: "لم يرجع مزود الصور نتيجة صالحة.", code: "EMPTY_IMAGE_RESULT" });
      }

      const imageUrl = b64 ? `data:image/png;base64,${b64}` : url!;
      return sendJson(response, 200, { success: true, imageUrl, model, isSimulation: false });
    } else {
      // For image edits endpoint
      const form = new FormData();
      form.append("model", model);
      form.append("prompt", prompt);
      form.append("size", imageSize);
      form.append("quality", imageQuality);
      form.append("image[]", new Blob([image.buffer], { type: image.mimetype }), image.originalname);

      const openaiResponse = await fetch(`${baseUrl}/images/edits`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: controller.signal,
      });

      const payload = await openaiResponse.json() as {
        data?: Array<{ b64_json?: string; url?: string }>;
        error?: { message?: string; type?: string };
      };

      if (!openaiResponse.ok) {
        console.error("OpenAI edit API error:", openaiResponse.status, payload.error?.message);
        return sendJson(response, 502, {
          error: payload.error?.message || "تعذر تعديل الواجهة من مزود الصور.",
          code: "IMAGE_PROVIDER_ERROR",
        });
      }

      const b64 = payload.data?.[0]?.b64_json;
      const url = payload.data?.[0]?.url;
      const imageUrl = b64 ? `data:image/png;base64,${b64}` : url!;
      return sendJson(response, 200, { success: true, imageUrl, model, isSimulation: false });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const timedOut = message === "This operation was aborted";
    console.error("Visualization request failed:", timedOut ? "timeout" : message);
    return sendJson(response, timedOut ? 504 : 500, {
      error: timedOut ? "انتهت مهلة التوليد. حاول بصورة أصغر أو أعد المحاولة." : "حدث خطأ غير متوقع أثناء معالجة التصور.",
      code: timedOut ? "IMAGE_PROVIDER_TIMEOUT" : "VISUALIZATION_FAILED",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function visualizeRoute(request: Request, response: Response, next: NextFunction) {
  upload.single("image")(request, response, (error) => {
    if (error) return next(error);
    void createVisualization(request, response).catch(next);
  });
}

export function visualizeErrorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    const isTooLarge = error.code === "LIMIT_FILE_SIZE";
    return sendJson(response, isTooLarge ? 413 : 400, {
      error: isTooLarge ? "حجم الصورة أكبر من 10MB." : "تعذر قراءة ملف الصورة. استخدم صورة واحدة بصيغة JPG أو PNG أو WebP.",
      code: isTooLarge ? "IMAGE_TOO_LARGE" : "UPLOAD_ERROR",
    });
  }
  console.error("Unhandled API error", error instanceof Error ? error.message : "unknown");
  return sendJson(response, 500, { error: "حدث خطأ غير متوقع.", code: "INTERNAL_ERROR" });
}
