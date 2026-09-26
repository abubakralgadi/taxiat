export type ArchitecturalPromptInput = {
  width: string;
  height: string;
  productCode: string;
  productName: string;
  stylePrompt: string;
};

export function buildArchitecturalPrompt(input: ArchitecturalPromptInput) {
  const arabicPrompt = `
تصميم معماري واقعي وفائق الدقة لواجهة مبنى معاصرة:
- تطبيق كسوة خارجية فاخرة من خامة: ${input.productName} (كود المنتج: ${input.productCode}).
- أبعاد الواجهة المقدرة: عرض ${input.width} متر في ارتفاع ${input.height} متر.
- النمط المعماري والتفاصيل: ${input.stylePrompt || "واجهة معاصرة هادئة وفخمة، مواد صادقة، فواصل ألواح دقيقة، وإضاءة طبيعية دافئة."}
- الحفاظ على كتلة المبنى وتوزيع النوافذ والفتحات بدقة متناهية.
- إخراج فوتوغرافي واقعي 8k مع ظلال وانعكاسات طبيعية لتفاصيل ملمس الكسوة وفواصل التركيب.
`.trim();

  const englishTranslation = `
Ultra-realistic architectural facade photography of a luxury contemporary building exterior.
The facade features high-end architectural exterior cladding made of ${input.productName} (Product code: ${input.productCode}).
Building proportions approximately ${input.width}m width by ${input.height}m height.
Design style: ${input.stylePrompt || "Clean minimalist luxury architecture, authentic natural material texture, precise architectural panel reveal joints, realistic daylight and elegant dusk exterior lighting."}
Strictly maintain the architectural massing, window placements, entrance geometry, and surrounding perspective.
Masterpiece 8k architectural photograph, clean lines, photorealistic material textures and realistic ambient shadows.
`.trim();

  return `${arabicPrompt}\n\n${englishTranslation}`;
}
