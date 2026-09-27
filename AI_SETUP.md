# تشغيل استديو الواجهات بالذكاء الاصطناعي — Nawa Studio

استديو نَوى يستخدم مسار خلفي آمن `POST /api/visualize` لمعالجة صور الواجهات وتطبيق خامات الإكساء المعمارية (WPC، HPL، TAXSTONE، FIBER CEMENT) عبر OpenAI Image API.

---

## 1. الإعداد والتشغيل السريع

1. قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع (يمكنك نسخ `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. أضف مفتاح OpenAI الخاص بك في ملف `.env`:
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
   OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst
   ```

> **ملاحظة:** حتى في حال عدم إضافة مفتاح OpenAI فوراً، سيعمل المشروع ومحرك المحاكاة التجريبي بسلاسة دون أخطاء، وعند إضافة المفتاح سيتم التوليد السحابي المباشر عبر الذكاء الاصطناعي.

عند النشر على Vercel، أضف `OPENAI_API_KEY` من **Project Settings → Environment Variables** إلى بيئة **Production** ثم أعد النشر. لا تضع المفتاح في متغير يبدأ بـ`VITE_` ولا في ملفات المشروع. النموذج أعلاه هو الافتراضي؛ يمكن حذف `OPENAI_IMAGE_MODEL` إن لم ترغب في تغييره.

---

## 2. أوامر التشغيل

- **وضع التطوير (Development):**
  ```bash
  pnpm dev
  ```
  سيعمل الموقع محلياً على: `http://localhost:3000`

- **فحص الأنواع وبناء الإنتاج (Build & Production):**
  ```bash
  pnpm check
  pnpm build
  pnpm start
  ```

---

## 3. معايير رفع الصور
- تقبل الواجهة صور الواجهات بصيغ: `JPG`, `PNG`, `WebP`.
- الحد الأقصى لحجم الملف: 4 ميجابايت، بما يتوافق مع حد طلبات Vercel.
- يُفضل استخدام صورة أمامية واضحة للواجهة مع تحديد الأبعاد التقريبية لتحقيق أفضل دقة ممكنة.
