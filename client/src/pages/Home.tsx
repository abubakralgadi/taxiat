import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CloudUpload,
  Download,
  ExternalLink,
  Facebook,
  Globe2,
  Heart,
  Instagram,
  Link2,
  Layers3,
  Linkedin,
  MessageCircle,
  MapPin,
  Menu,
  MoveDownRight,
  MousePointer2,
  Phone,
  Plus,
  RefreshCw,
  Ruler,
  Scan,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import BeforeAfterViewer from "@/components/BeforeAfterViewer";
import {
  generateVisualization,
  type GenerationStage,
} from "@/services/aiStudio";

const storage = {
  hero: "/images/hero.jpg",
  materials: "/images/materials.jpg",
  showcase: "/images/showcase.jpg",
};

type Product = {
  code: string;
  name: string;
  category: string;
  finish: string;
  tone: string;
  swatch: string;
};

const products: Product[] = [
  { code: "TX-CL01", name: "صفائح الطين المعالج MCM", category: "صفائح الطين", finish: "ترافرتين صحراوي", tone: "خفة وزن ومرونة فائقة", swatch: "#c9b49a" },
  { code: "TX-WP09", name: "بديل الخشب WPC خردلي دافئ", category: "بديل الخشب", finish: "تيك طبيعي", tone: "مقاوم لحرارة وشمس الخليج", swatch: "#ae8c65" },
  { code: "TX-WP30", name: "بديل الخشب WPC رمادي", category: "بديل الخشب", finish: "بلوط رمادي معاصر", tone: "طابع مودرن هادئ", swatch: "#a59d91" },
  { code: "TX-ST04", name: "الصفائح الحجرية المرنة", category: "الصفائح الحجرية", finish: "حجر طبيعي بارز", tone: "ملمس طبيعي وفخامة الحجر", swatch: "#cfc4af" },
  { code: "TX-HP12", name: "ألواح HPL خارجية", category: "HPL", finish: "فحمي مطفي فاخر", tone: "مقاوم للخدش والرطوبة", swatch: "#383936" },
  { code: "TX-FC21", name: "ألواح فايبر سمنت", category: "فايبر سمنت", finish: "رمادي خرساني ناعم", tone: "كتل معمارية معاصرة", swatch: "#777873" },
  { code: "TX-WP46", name: "بديل الخشب WPC جوز داكن", category: "بديل الخشب", finish: "جوز ملكي", tone: "تفاصيل راقية للقصور والفلل", swatch: "#5a493d" },
  { code: "TX-CL05", name: "صفائح طين معالج MCM ريفي", category: "صفائح الطين", finish: "طوب معتق دافئ", tone: "طابع ريفي معاصر", swatch: "#9e5f48" },
];

const categories = ["الكل", "صفائح الطين", "بديل الخشب", "الصفائح الحجرية", "HPL", "فايبر سمنت"];
const materialFamilies = [
  { index: "01", name: "صفائح الطين المعالج (MCM)", description: "مرونة مذهلة في المنحنيات والواجهات، خفة وزن وألوان طبيعية تدوم.", image: storage.materials, accent: "#b37452" },
  { index: "02", name: "بديل الخشب الخارجي (WPC)", description: "دفء وجمال الخشب مع مقاومة فائقة لأشعة الشمس والحرارة والرطوبة.", image: storage.hero, accent: "#a78158" },
  { index: "03", name: "الصفائح الحجرية المرنة", description: "أصالة وفخامة الحجر الطبيعي بسماكة مليمترات وسهولة تركيب قياسية.", image: storage.showcase, accent: "#b9a88e" },
  { index: "04", name: "ألواح HPL والفايبر سمنت", description: "كتل معمارية حادة وخطوط نظيفة وثبات لوني استثنائي للمشاريع الراقية.", image: storage.materials, accent: "#4d514e" },
];

const journey = [
  { index: "01", title: "نقرأ المشروع", text: "الموقع، المقاسات، التعرض للشمس، وطبيعة المبنى.", icon: Scan },
  { index: "02", title: "نوازن المواد", text: "لون، ملمس، فواصل، تكلفة، وصيانة على المدى الطويل.", icon: Layers3 },
  { index: "03", title: "نحوّل القرار لتنفيذ", text: "تفاصيل واضحة ومتابعة دقيقة من العينة إلى الواجهة.", icon: Ruler },
];

const stages: GenerationStage[] = [
  { label: "جاري تحليل الصورة", duration: 720 },
  { label: "جاري تحديد الأسطح", duration: 820 },
  { label: "جاري تطبيق المنتج", duration: 900 },
  { label: "جاري تحسين النتيجة", duration: 760 },
];

function SectionMarker({ number, eyebrow, light = false }: { number: string; eyebrow: string; light?: boolean }) {
  return (
    <div className={`section-marker ${light ? "section-marker--light" : ""}`}>
      <span>{number}</span>
      <i />
      <b>{eyebrow}</b>
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className={`brand ${compact ? "brand--compact" : ""}`} aria-label="شركة تكسيات — الصفحة الرئيسية">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span className="brand-word"><strong>تكسيات</strong><small>TAXIAT / FACADES</small></span>
    </a>
  );
}

function ProductCard({ product, selected, favorite, onSelect, onToggleFavorite }: { product: Product; selected: boolean; favorite: boolean; onSelect: () => void; onToggleFavorite: () => void }) {
  return (
    <div className={`product-card ${selected ? "product-card--selected" : ""}`}>
      <button type="button" className="product-card__select" onClick={onSelect} aria-pressed={selected}>
      <span className="product-card__visual" style={{ background: `linear-gradient(135deg, ${product.swatch}, #262722)` }}>
        <span className="product-card__grain" />
        {selected && <span className="product-card__check"><Check size={13} /></span>}
      </span>
      <span className="product-card__meta">
        <strong>{product.name}</strong>
        <small>{product.category} <em>·</em> {product.finish}</small>
      </span>
      <span className="product-card__arrow"><ArrowUpLeft size={15} /></span>
      </button>
      <button type="button" className={`favorite-button ${favorite ? "favorite-button--active" : ""}`} onClick={onToggleFavorite} aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `حفظ ${product.name} في المفضلة`} title={favorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}><Heart size={14} fill={favorite ? "currentColor" : "none"} /></button>
    </div>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState("18");
  const [height, setHeight] = useState("9");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [stylePrompt, setStylePrompt] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("taxiat-favorites") ?? "[]");
    } catch {
      return [];
    }
  });
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(100);
  const [stage, setStage] = useState("التصور جاهز للمراجعة");
  const [generated, setGenerated] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "الكل" || product.category === category;
      const matchesQuery = !normalized || `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(normalized);
      const matchesFavorite = !favoritesOnly || favorites.includes(product.code);
      return matchesCategory && matchesQuery && matchesFavorite;
    });
  }, [category, favorites, favoritesOnly, query]);

  useEffect(() => {
    window.localStorage.setItem("taxiat-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedProduct = products.find((product) => product.code === params.get("product"));
    if (linkedProduct) setSelectedProduct(linkedProduct);
    if (params.get("width")) setWidth(params.get("width")!);
    if (params.get("height")) setHeight(params.get("height")!);
    if (params.get("style")) setStylePrompt(params.get("style")!);
  }, []);

  const handleFile = (file?: File) => {
    setUploadError(null);
    if (!file) return;
    const accepted = ["image/jpeg", "image/png", "image/webp"];
    if (!accepted.includes(file.type)) {
      setUploadError("صيغة غير مدعومة. استخدم JPG أو PNG أو WebP.");
      toast.error("تعذر رفع الصورة", { description: "الصيغ المدعومة: JPG، PNG، WebP" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("حجم الصورة أكبر من 10MB.");
      toast.error("الصورة كبيرة جدًا", { description: "اختر صورة بحجم أقل من 10MB." });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setImageFile(file);
    setGeneratedImage(null);
    setFileName(file.name);
    toast.success("تمت إضافة الصورة", { description: "أدخل المقاسات واختر خامتك للمتابعة." });
  };

  const clearPreview = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageFile(null);
    setGeneratedImage(null);
    setFileName(null);
    setUploadError(null);
  };

  const toggleFavorite = (code: string) => {
    setFavorites((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
    const product = products.find((item) => item.code === code);
    toast.success(favorites.includes(code) ? `أزيل ${product?.name} من المفضلة` : `حُفظ ${product?.name} في المفضلة`);
  };

  const runGeneration = async () => {
    if (!preview || !imageFile) {
      toast.error("أضف صورة الواجهة أولًا", { description: "يمكنك استخدام صورة من جهازك بصيغة JPG أو PNG أو WebP." });
      return;
    }
    if (!Number(width) || !Number(height) || Number(width) <= 0 || Number(height) <= 0) {
      toast.error("تحقق من المقاسات", { description: "أدخل عرضًا وارتفاعًا أكبر من صفر." });
      return;
    }
    setIsGenerating(true);
    setGenerated(false);
    try {
      const result = await generateVisualization({ image: imageFile, width, height, productCode: selectedProduct.code, productName: selectedProduct.name, stylePrompt }, (nextProgress, nextStage) => {
        setProgress(nextProgress);
        setStage(nextStage);
      });
      setGeneratedImage(result.imageUrl);
      setGenerated(true);
      if (result.isSimulation) {
        toast.info("تم إنشاء المعاينة بنجاح", {
          description: result.note || "أضف OPENAI_API_KEY في ملف .env لتفعيل التوليد المباشر بالذكاء الاصطناعي.",
          duration: 6000,
        });
      } else {
        toast.success("اكتمل التصور بالذكاء الاصطناعي", {
          description: `تم تطبيق ${selectedProduct.name} عبر نموذج ${result.model}.`,
        });
      }
    } catch (error) {
      toast.error("تعذر إنشاء التصور", { description: error instanceof Error ? error.message : "حاول مرة أخرى بعد قليل." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage ?? storage.showcase;
    link.download = "taxiat-facade-visualization.jpg";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
    toast.success("جاري تجهيز التنزيل");
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("product", selectedProduct.code);
    url.searchParams.set("width", width);
    url.searchParams.set("height", height);
    if (stylePrompt.trim()) url.searchParams.set("style", stylePrompt.trim());
    url.hash = "studio";
    return url.toString();
  };

  const handleCopyShareLink = async () => {
    await navigator.clipboard?.writeText(getShareUrl());
    toast.success("تم نسخ الرابط المباشر", { description: "يمكنك إرساله لأي شخص لفتح نتيجة التصميم." });
    setShareOpen(false);
  };

  const handleShareChannel = async (channel: "native" | "whatsapp" | "linkedin" | "x") => {
    const url = getShareUrl();
    const text = `شاهد تصوري لواجهتي بخامات شركة تكسيات (Taxiat Co) — ${selectedProduct.name}`;
    if (channel === "native" && navigator.share) await navigator.share({ title: "تصوري من تكسيات", text, url });
    else if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
    else if (channel === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
    else if (channel === "x") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
    else await handleCopyShareLink();
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell" dir="rtl" id="top">
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={`main-nav ${mobileOpen ? "main-nav--open" : ""}`} aria-label="التنقل الرئيسي">
            <button onClick={() => scrollTo("materials")} type="button">الخامات</button>
            <button onClick={() => scrollTo("studio")} type="button">استديو تكسيات الذكي</button>
            <button onClick={() => scrollTo("how-it-works")} type="button">كيف نعمل</button>
            <button onClick={() => scrollTo("showcase")} type="button">المشاريع</button>
            <button onClick={() => scrollTo("contact")} type="button">تواصل معنا</button>
          </nav>
          <div className="header-actions">
            <button className="language-toggle" type="button" onClick={() => toast.info("النسخة الإنجليزية قادمة قريبًا")}>EN</button>
            <button className="button button--dark button--small header-cta" type="button" onClick={() => scrollTo("studio")}>
              جرّب الاستديو <ArrowUpLeft size={15} />
            </button>
            <button className="menu-toggle" type="button" onClick={() => setMobileOpen((current) => !current)} aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-backdrop" style={{ backgroundImage: `url(${storage.hero})` }} />
          <div className="hero-scrim" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="eyebrow eyebrow--light"><span className="eyebrow-dot" /> شركة تكسيات — رواد تكسيات الواجهات والديكور</div>
              <h1>شوف واجهتك<br /><span>قبل ما تبدأ التنفيذ.</span></h1>
              <p>ارفع صورة فلتك أو مشروعك، اختر خامتك من تكسيات (بديل الخشب، صفائح الطين، أو الحجر المرن)، وشاهد الواجهة كما ستكون على أرض الواقع.</p>
              <div className="hero-actions">
                <button className="button button--copper" type="button" onClick={() => scrollTo("studio")}>ابدأ تصميم واجهتك <ArrowUpLeft size={17} /></button>
                <button className="text-button text-button--light" type="button" onClick={() => scrollTo("materials")}>اكتشف خامات تكسيات <ArrowLeft size={16} /></button>
              </div>
            </div>
            <div className="hero-side-note">
              <span className="vertical-rule" />
              <span>قرار أوضح<br />من أول صورة</span>
            </div>
            <div className="hero-floating-card">
              <div className="floating-card__top"><span>TAXIAT / LIVE PREVIEW</span><span className="live-dot" /></div>
              <div className="floating-card__image" style={{ backgroundImage: `url(${storage.showcase})` }} />
              <div className="floating-card__bottom"><span>بديل الخشب / WPC</span><span>18 × 9 م</span></div>
            </div>
          </div>
          <div className="container hero-footer">
            <span>تصور بصري استرشادي لاختيار خامات تكسيات، والتنفيذ يتم عبر فريقنا الفني المتخصص.</span>
            <span className="hero-scroll"><MoveDownRight size={14} /> مرّر لتكتشف</span>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-grid">
            <div className="stat-item"><strong>+12</strong><span>سنة خبرة</span></div>
            <div className="stat-item"><strong>4,500<span>+</span></strong><span>مشروع وواجهة</span></div>
            <div className="stat-item"><strong>250<span>+</span></strong><span>خامة وتشكيلة</span></div>
            <div className="stat-item"><strong>السعودية & الكويت</strong><span>فروع وخدمة</span></div>
            <div className="stats-note"><CircleDot size={13} /> رواد حلول التكسيات المعمارية الحديثة</div>
          </div>
        </section>

        <section className="manifesto-section" id="about">
          <div className="container manifesto-grid">
            <div className="manifesto-label"><SectionMarker number="T / 01" eyebrow="رؤية تكسيات" /><span className="manifesto-outline">01</span></div>
            <div className="manifesto-copy">
              <h2>الخامة هي أول انطباع.<br /><em>واختيارها الصحيح</em> يصنع<br />فخامة المبنى.</h2>
              <div className="manifesto-bottom"><p>في شركة تكسيات نحرص على تقديم أفضل حلول التكسيات المعمارية المطابقة لأعلى معايير الجودة والمقاومة لعوامل الطقس في المملكة والخليج. نساعدك تشوف البدائل بوضوح ونرافقك من العينة حتى آخر لوح في الواجهة.</p><button className="text-button" type="button" onClick={() => scrollTo("studio")}>اختبر خاماتك في الاستديو <ArrowUpLeft size={16} /></button></div>
            </div>
          </div>
        </section>

        <section className="studio-section" id="studio">
          <div className="container">
            <div className="studio-heading">
              <div><SectionMarker number="T / 02" eyebrow="TAXIAT AI STUDIO" light /><h2>استديو تكسيات<br /><em>لتصميم الواجهات.</em></h2></div>
              <div className="studio-intro"><p>صورة واحدة تكفي لتبدأ. نستخدم الذكاء الاصطناعي لفهم الواجهة ثم إعادة تصورها بخامات تكسيات المعتمدة (بديل الخشب، صفائح الطين، أو الحجر المرن) مع الحفاظ على كتلة المبنى وفتحاتِه.</p><span>4 خطوات · أقل من دقيقتين</span></div>
            </div>
            <div className="studio-layout">
              <div className="studio-panel">
                <div className="studio-steps" aria-label="خطوات الاستديو">
                  <div className="studio-step studio-step--active"><span>01</span><b>الصورة</b></div>
                  <div className="studio-step"><span>02</span><b>المقاس</b></div>
                  <div className="studio-step"><span>03</span><b>الخامة</b></div>
                  <div className="studio-step"><span>04</span><b>التصور</b></div>
                </div>

                <div className="studio-form">
                  <div className="form-section">
                    <div className="form-section__head"><span>01</span><div><h3>أضف صورة الواجهة</h3><p>صورة أمامية واضحة للفيلا أو المبنى تعطيك نتيجة أدق.</p></div></div>
                    <input ref={fileInputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
                    {!preview ? (
                      <button type="button" className={`upload-zone ${isDragging ? "upload-zone--dragging" : ""}`} onClick={() => fileInputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0]); }}>
                        <span className="upload-icon"><CloudUpload size={20} /></span><strong>اسحب صورة الواجهة هنا</strong><span>أو اضغط للاختيار · JPG / PNG / WebP</span><small>حتى 10MB</small>
                      </button>
                    ) : (
                      <div className="upload-preview"><img src={preview} alt="معاينة صورة الواجهة المرفوعة" /><div className="upload-preview__overlay"><span><CheckCircle2 size={15} /> {fileName}</span><div><button type="button" onClick={() => fileInputRef.current?.click()}>استبدال</button><button type="button" onClick={clearPreview} aria-label="إزالة الصورة"><X size={15} /></button></div></div></div>
                    )}
                    {uploadError && <div className="form-error"><X size={14} /> {uploadError}</div>}
                  </div>

                  <div className="form-section">
                    <div className="form-section__head"><span>02</span><div><h3>مقاس الواجهة التقريبي</h3><p>يكفي تقدير أولي بالأمتار لحساب تناسب الألواح.</p></div></div>
                    <div className="dimensions-grid">
                      <label>العرض<input inputMode="decimal" value={width} onChange={(event) => setWidth(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="18" /><em>متر</em></label>
                      <label>الارتفاع<input inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="9" /><em>متر</em></label>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-section__head"><span>03</span><div><h3>صف النمط المطلوب</h3><p>اكتب لمستك ليطبقها الذكاء الاصطناعي مع خامة تكسيات.</p></div></div>
                    <textarea className="style-prompt" value={stylePrompt} onChange={(event) => setStylePrompt(event.target.value)} maxLength={240} placeholder="مثال: تطبيق بديل الخشب على الكتلة البارزة مع صفائح طين معالج في المدخل وإضاءة ليد مخفية..." aria-label="وصف النمط المطلوب" />
                    <div className="prompt-footer"><span><Sparkles size={13} /> يدعم الوصف الحر وخامات تكسيات</span><small>{stylePrompt.length}/240</small></div>
                  </div>

                  <div className="form-section" id="studio-selector">
                    <div className="form-section__head"><span>04</span><div><h3>اختر خامة تكسيات</h3><p>ابحث باسم الخامة أو الكود.</p></div><small className="results-count">{filteredProducts.length} منتجات</small></div>
                    <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم خامة تكسيات أو الكود" /><SlidersHorizontal size={15} /></div>
                    <div className="chip-row">{categories.map((item) => <button type="button" key={item} className={category === item ? "chip chip--active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}<button type="button" className={`chip chip--favorite ${favoritesOnly ? "chip--active" : ""}`} onClick={() => setFavoritesOnly((current) => !current)}><Heart size={12} fill={favoritesOnly ? "currentColor" : "none"} /> المفضلة {favorites.length ? `(${favorites.length})` : ""}</button></div>
                    <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.code} product={product} selected={selectedProduct.code === product.code} favorite={favorites.includes(product.code)} onSelect={() => { setSelectedProduct(product); toast.success(`تم اختيار ${product.name}`); }} onToggleFavorite={() => toggleFavorite(product.code)} />)}</div>
                    {filteredProducts.length === 0 && <div className="empty-state"><Search size={18} /><strong>لا توجد نتائج</strong><span>جرّب اسمًا أو كودًا مختلفًا.</span></div>}
                    <div className="selected-product"><span className="selected-product__image" style={{ background: `linear-gradient(135deg, ${selectedProduct.swatch}, #282923)` }} /><span><small>اختيارك الحالي</small><strong>{selectedProduct.name}</strong><em>{selectedProduct.category} · {selectedProduct.finish}</em></span><BadgeCheck size={18} /></div>
                  </div>

                  <div className="studio-submit">
                    <div><Sparkles size={17} /><span>محاكاة معمارية سريعة بدقة عالية</span></div>
                    <button type="button" className="button button--copper button--wide" onClick={runGeneration} disabled={isGenerating}>{isGenerating ? <><RefreshCw className="spin" size={16} /> {Math.round(progress)}%</> : <>أنشئ التصور بالذكاء الاصطناعي <ArrowUpLeft size={16} /></>}</button>
                    <small>تصور بصري استرشادي — يمكنك طلب عينات مجانية وزيارة فروع تكسيات.</small>
                  </div>
                </div>
              </div>

              <div className="studio-result">
                <div className="result-topline"><span><span className="live-dot live-dot--dark" /> المعاينة الحية</span><span>{width || "—"} × {height || "—"} م · {selectedProduct.name}</span></div>
                {isGenerating ? (
                  <div className="generation-state"><div className="generation-orbit"><span /><span /><span /></div><p>{stage}</p><div className="progress-line"><span style={{ width: `${progress}%` }} /></div><small>نحافظ على أبعاد وفتحات المبنى، ونطبّق خامات تكسيات بواقعية.</small></div>
                ) : generated ? (
                  <>
                    <BeforeAfterViewer before={preview ?? storage.hero} after={generatedImage ?? storage.showcase} beforeAlt="صورة واجهة قبل تطبيق خامة تكسيات" afterAlt={`تصور الواجهة بعد تطبيق ${selectedProduct.name}`} />
                    <div className="result-caption"><div><span>مثال توضيحي جاهز · حرّك الفاصل لترى قبل وبعد.</span><strong>{selectedProduct.name}</strong></div><div className="result-actions"><button type="button" onClick={handleDownload} aria-label="تنزيل النتيجة" title="تنزيل النتيجة"><Download size={16} /></button><button type="button" onClick={() => { setGenerated(false); setTimeout(() => setGenerated(true), 240); }} aria-label="إعادة التوليد" title="إعادة التوليد"><RefreshCw size={16} /></button><button type="button" onClick={() => scrollTo("studio-selector")} aria-label="تغيير المنتج" title="تغيير المنتج"><Plus size={17} /></button><button type="button" onClick={() => setShareOpen((current) => !current)} aria-label="مشاركة النتيجة" title="مشاركة النتيجة"><Share2 size={16} /></button></div></div>
                    {shareOpen && <div className="share-panel"><div><strong>شارك النتيجة</strong><span>أرسلها كرابط مباشر أو عبر قناتك المفضلة.</span></div><div className="share-options"><button type="button" onClick={handleCopyShareLink}><Link2 size={15} /> نسخ الرابط</button><button type="button" onClick={() => handleShareChannel("whatsapp")}><MessageCircle size={15} /> واتساب</button><button type="button" onClick={() => handleShareChannel("x")}><span className="share-x">𝕏</span> X</button><button type="button" onClick={() => handleShareChannel("linkedin")}><Linkedin size={15} /> LinkedIn</button>{("share" in navigator) && <button type="button" onClick={() => handleShareChannel("native")}><Send size={15} /> مشاركة</button>}</div></div>}
                  </>
                ) : <div className="result-empty"><Camera size={22} /><strong>النتيجة ستظهر هنا</strong><span>أضف صورة واجهتك ثم ابدأ المعاينة.</span></div>}
              </div>
            </div>
          </div>
        </section>

        <section className="materials-section" id="materials">
          <div className="container">
            <div className="section-heading-row"><div><SectionMarker number="T / 03" eyebrow="خامات تكسيات" /><h2>مصممة للمناخ الخليجي.<br /><em>ولجمال الواجهة.</em></h2></div><div className="heading-side"><p>كل خامة من تكسيات تخضع لأعلى معايير مقاومة الحرارة والرطوبة وثبات اللون، لتمنح واجهتك عمراً مديداً ومظهراً فخماً.</p><button className="round-arrow" type="button" onClick={() => setShowGuide(true)} aria-label="افتح دليل الخامات"><ArrowUpLeft size={19} /></button></div></div>
            <div className="materials-grid">{materialFamilies.map((material, index) => <button type="button" key={material.name} className={`material-card ${activeMaterial === index ? "material-card--active" : ""}`} onMouseEnter={() => setActiveMaterial(index)} onFocus={() => setActiveMaterial(index)} onClick={() => { setActiveMaterial(index); setShowGuide(true); }}><img src={material.image} alt={`خامة ${material.name}`} loading="lazy" /><div className="material-card__shade" /><span className="material-card__index">{material.index}</span><span className="material-card__name">{material.name}</span><span className="material-card__desc">{material.description}</span><span className="material-card__plus"><Plus size={17} /></span></button>)}</div>
            <div className="material-footnote"><span><MousePointer2 size={15} /> حرّك المؤشر لاكتشاف الفرق</span><span>كل واجهة تبدأ باختيار الخامة المناسبة.</span></div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading-row section-heading-row--light"><div><SectionMarker number="T / 04" eyebrow="خطوات العمل" light /><h2>من الفكرة والمحاكاة<br /><em>إلى التركيب والتسليم.</em></h2></div><div className="heading-side"><p>لا نكتفي بتوريد المواد فقط. نقدم في تكسيات دراسة معمارية ومخططات تنفيذية وإشرافاً فنياً لضمان أعلى مستويات الجودة.</p><button className="text-button text-button--light" type="button" onClick={() => scrollTo("contact")}>تواصل مع مستشار تكسيات <ArrowLeft size={16} /></button></div></div>
            <div className="journey-grid">{journey.map(({ index, title, text, icon: Icon }, itemIndex) => <div className="journey-card" key={index}><div className="journey-card__top"><span>{index}</span><Icon size={22} strokeWidth={1.3} /></div><div className="journey-card__line"><span style={{ width: `${((itemIndex + 1) / journey.length) * 100}%` }} /></div><h3>{title}</h3><p>{text}</p></div>)}</div>
            <div className="how-bottom"><span>01 — دراسة الواجهة</span><span>02 — اختيار وتوريد الخامات</span><span>03 — التركيب والضمان</span><span className="how-bottom__mark">TAXIAT /</span></div>
          </div>
        </section>

        <section className="showcase-section" id="showcase">
          <div className="container">
            <div className="section-heading-row"><div><SectionMarker number="T / 05" eyebrow="مشاريع تكسيات" /><h2>واجهات<br /><em>تتحدث بفخامتها.</em></h2></div><div className="heading-side"><p>من الفلل السكنية الفاخرة إلى المباني التجارية، نفخر بتنفيذ وتوريد تكسيات معمارية مميزة في السعودية والكويت.</p><a className="round-arrow" href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer" aria-label="شاهد المزيد على إنستغرام تكسيات"><ArrowUpLeft size={19} /></a></div></div>
            <div className="showcase-grid"><article className="showcase-card showcase-card--large"><div className="showcase-image"><img src={storage.showcase} alt="فيلا معاصرة بخامات تكسيات" loading="lazy" /><span>01 / 03</span></div><div className="showcase-meta"><div><small>الرياض · سكني فاخر</small><h3>تناغم بديل الخشب مع الحجر</h3></div><span>بديل الخشب WPC + صفائح حجرية</span></div></article><article className="showcase-card showcase-card--small"><div className="showcase-image"><img src={storage.materials} alt="تفاصيل خامات معمارية من تكسيات" loading="lazy" /><span>02 / 03</span></div><div className="showcase-meta"><div><small>الكويت & الرياض · تجاري وسكني</small><h3>فخامة الملمس الطبيعي</h3></div><span>صفائح الطين MCM + HPL</span></div></article></div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-visual" style={{ backgroundImage: `url(${storage.hero})` }} /><div className="contact-overlay" />
          <div className="container contact-content"><div><SectionMarker number="T / 06" eyebrow="تواصل مع تكسيات" light /><h2>كل واجهة تبدأ<br /><em>باختيار صحيح.</em></h2><p>شاركنا مخططاتك أو صور واجهتك، وفريق شركة تكسيات يقدّم لك المشورة الفنية وعينات مجانية لمشروعك.</p><a className="button button--copper" href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer">تواصل عبر إنستغرام تكسيات <ArrowUpLeft size={17} /></a></div><div className="contact-note"><span>تابع حسابنا الرسمي</span><a href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer">@taxiat_co <Instagram size={15} /></a></div></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top"><Logo compact /><p>شركة تكسيات — رواد توريد وتركيب تكسيات الواجهات والديكورات الداخلية والخارجية.<br />حلول معمارية مبتكرة تدوم لعقود.</p><div className="footer-links"><div><small>استكشف</small><button type="button" onClick={() => scrollTo("materials")}>الخامات</button><button type="button" onClick={() => scrollTo("studio")}>استديو تكسيات الذكي</button><button type="button" onClick={() => scrollTo("showcase")}>المشاريع</button></div><div><small>تواصل</small><a href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer">إنستغرام: @taxiat_co</a><a href="https://taxiat.com.sa" target="_blank" rel="noreferrer">taxiat.com.sa</a><span>المملكة العربية السعودية · دولة الكويت</span></div></div></div>
        <div className="container footer-bottom"><span>© 2026 شركة تكسيات لتكسيات الواجهات والديكور (Taxiat Co.) — جميع الحقوق محفوظة</span><div className="socials"><a href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href="https://taxiat.com.sa" target="_blank" rel="noreferrer" aria-label="الموقع"><Globe2 size={16} /></a></div><span>الرياض · جدة · الكويت</span></div>
      </footer>

      {showGuide && <div className="modal-backdrop" role="presentation" onClick={() => setShowGuide(false)}><div className="material-modal" role="dialog" aria-modal="true" aria-labelledby="material-guide-title" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowGuide(false)} aria-label="إغلاق"><X size={18} /></button><div className="modal-kicker">TAXIAT / MATERIAL GUIDE</div><h2 id="material-guide-title">{materialFamilies[activeMaterial].name}</h2><p>{materialFamilies[activeMaterial].description}</p><div className="modal-image"><img src={materialFamilies[activeMaterial].image} alt="" /></div><div className="modal-details"><span><small>التكوين</small><strong>جودة معتمدة</strong></span><span><small>الطابع</small><strong>فخامة معاصرة</strong></span><span><small>الاستخدام</small><strong>واجهات خارجية وتكسيات داخلية</strong></span></div><button type="button" className="button button--dark button--wide" onClick={() => { setShowGuide(false); scrollTo("studio"); }}>جرّب هذه الخامة في الاستديو <ArrowUpLeft size={16} /></button></div></div>}
    </div>
  );
}

export default Home;
