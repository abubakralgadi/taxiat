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

  if (!response.ok) {
    const serverMessage = payload && "error" in payload && typeof payload.error === "string" ? payload.error : null;
    const fallback = response.status === 413
      ? "حجم الصورة يتجاوز الحد المسموح به على الخادم. اختر صورة أصغر من 4MB."
      : `فشل خادم التوليد (${response.status}). راجع سجل /api/visualize في Vercel Logs.`;
    throw new Error(serverMessage || fallback);
  }

  if (!payload || !("imageUrl" in payload) || !payload.imageUrl) {
    throw new Error("لم تصل صورة صالحة من خادم التوليد.");
  }

  onStatus?.("اكتمل التصور بنجاح");
  return payload;
}
