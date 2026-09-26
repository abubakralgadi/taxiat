export type GenerationStage = {
  label: string;
  duration: number;
};

export type VisualizationRequest = {
  image: File;
  width: string;
  height: string;
  productCode: string;
  productName: string;
  stylePrompt: string;
};

export type VisualizationResponse = {
  success: true;
  imageUrl: string;
  model: string;
  requestId?: string;
  isSimulation?: boolean;
  note?: string;
};

export async function generateVisualization(
  request: VisualizationRequest,
  onProgress?: (progress: number, stage: string) => void,
): Promise<VisualizationResponse> {
  const formData = new FormData();
  formData.append("image", request.image, request.image.name);
  formData.append("width", request.width);
  formData.append("height", request.height);
  formData.append("productCode", request.productCode);
  formData.append("productName", request.productName);
  formData.append("stylePrompt", request.stylePrompt.trim());

  onProgress?.(15, "جاري رفع صورة الواجهة وتحليل الأبعاد");

  const response = await fetch("/api/visualize", {
    method: "POST",
    body: formData,
  });

  onProgress?.(70, "جاري معالجة الكسوة وتطبيق الخامة بالذكاء الاصطناعي");

  const payload = await response.json().catch(() => null) as
    | VisualizationResponse
    | { error?: string }
    | null;

  if (!response.ok || !payload || !("imageUrl" in payload)) {
    throw new Error(payload && "error" in payload ? payload.error : "تعذر إنشاء التصور حاليًا");
  }

  onProgress?.(100, "اكتمل التصور بنجاح");
  return payload;
}
