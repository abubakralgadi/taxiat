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
  onStatus?: (stage: string) => void,
): Promise<VisualizationResponse> {
  const formData = new FormData();
  formData.append("image", request.image, request.image.name);
  formData.append("width", request.width);
  formData.append("height", request.height);
  formData.append("productCode", request.productCode);
  formData.append("productName", request.productName);
  formData.append("stylePrompt", request.stylePrompt.trim());

  onStatus?.("جارٍ إرسال الصورة وطلب التصور");

  const response = await fetch("/api/visualize", {
    method: "POST",
    body: formData,
  });

  onStatus?.("وصلت الاستجابة، نجهّز الصورة للعرض");

  const payload = await response.json().catch(() => null) as
    | VisualizationResponse
    | { error?: string }
    | null;

  if (!response.ok || !payload || !("imageUrl" in payload)) {
    throw new Error(payload && "error" in payload ? payload.error : "تعذر إنشاء التصور حاليًا");
  }

  onStatus?.("اكتمل التصور بنجاح");
  return payload;
}
