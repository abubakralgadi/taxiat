import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  CloudUpload,
  Download,
  Globe2,
  Heart,
  Info,
  Instagram,
  Link2,
  Layers3,
  Linkedin,
  MessageCircle,
  Menu,
  Plus,
  RefreshCw,
  Ruler,
  Scan,
  Search,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import BeforeAfterViewer from "@/components/BeforeAfterViewer";
import { generateVisualization } from "@/services/aiStudio";

const storage = {
  hero: "/images/hero.jpg",
  materials: "/images/materials.jpg",
  showcase: "/images/showcase.jpg",
};
const quoteUrl = "https://taxiat.com.sa/contacts/";

type Product = {
  code: string;
  name: string;
  category: string;
  finish: string;
  tone: string;
  swatch: string;
  description?: string;
  isCategory?: boolean;
};

const products: Product[] = [
  { code: "Travertine Golden White", name: "صفائح طينية · Golden White", category: "صفائح الطين", finish: "ترافرتين فاتح", tone: "سطح طبيعي دافئ", swatch: "#c9b49a", description: "صفائح طين معالج بملمس الترافرتين الطبيعي، تمنح الواجهة طابعًا صحراويًا دافئًا ومقاومة عالية للعوامل الجوية." },
  { code: "US09", name: "بديل الخشب WPC · US09", category: "بديل الخشب", finish: "تشطيب خشبي", tone: "تكسيات جدارية خارجية", swatch: "#ae8c65", description: "ألواح خشب بلاستيكي معالج خارجي مقاوم للشمس والرطوبة مع خطوط طولية عصرية." },
  { code: "US30", name: "بديل الخشب WPC · US30", category: "بديل الخشب", finish: "تشطيب خشبي", tone: "تكسيات جدارية خارجية", swatch: "#a59d91", description: "بديل خشب بدرجة رمادية دافئة تناسب الكتل المودرن والمدخل الرئيسي." },
  { code: "STONE", name: "الصفائح الحجرية المرنة", category: "الصفائح الحجرية", finish: "اللون حسب الاختيار", tone: "ملمس حجري طبيعي", swatch: "#cfc4af", isCategory: true, description: "طبقة حجرية طبيعية مرنة وخفيفة الوزن تُركب بسهولة على الكتل والواجهات الكبيرة." },
  { code: "10002", name: "ألواح HPL · Mangfall Beech", category: "HPL", finish: "نقشة خشبية", tone: "ألواح للواجهات والتفاصيل", swatch: "#ad8f72", description: "ألواح خشب ضغط عالي HPL مقاومة للصدمات والخدش مع مظهر الخشب الطبيعي." },
  { code: "FIBER", name: "ألواح فايبر سمنت", category: "فايبر سمنت", finish: "اللون حسب الاختيار", tone: "خطوط معمارية هادئة", swatch: "#777873", isCategory: true, description: "ألواح أسمنتية ألياف حجرية متينة تمنح المبنى طابعًا هندسيًا معاصرًا." },
  { code: "UH46", name: "بديل الخشب WPC · UH46", category: "بديل الخشب", finish: "تشطيب خشبي", tone: "تكسيات جدارية خارجية", swatch: "#5a493d", description: "بديل خشب داكن فاخر مع حماية مضاعفة للكتل البارزة وكاسرات الشمس." },
  { code: "US31", name: "بديل الخشب WPC · US31", category: "بديل الخشب", finish: "Teak", tone: "مستخدم في مشروع عنوان القهوة", swatch: "#a47b52", description: "لون التيك الشهير المستخدم في واجهات التجارب والمقاهي الحديثة." },
  { code: "UH61", name: "بديل الخشب WPC · UH61", category: "بديل الخشب", finish: "Teak", tone: "مستخدم في مشروع عنوان القهوة", swatch: "#976d49", description: "قطاعات WPC بعمق بارز لإيجاد إيقاع ضل ونور ساحر في الواجهة." },
  { code: "Travertine Golden Gray", name: "صفائح طينية · Golden Gray", category: "صفائح الطين", finish: "ترافرتين رمادي", tone: "تدرج طبيعي هادئ", swatch: "#aaa69d", description: "تدرج رمادي فاتح مائل للحجر الجيري، مناسب للمباني المعاصرة والفيلل الفاخرة." },
];

const categories = ["الكل", "صفائح الطين", "بديل الخشب", "الصفائح الحجرية", "HPL", "فايبر سمنت"];
const materialFamilies = [
  { index: "01", name: "صفائح الطين المعالج", latin: "MCM / CLAY", category: "صفائح الطين", description: "سطح دافئ بتدرجات أرضية، يمنح الكتل الهادئة عمقًا وملمسًا طبيعيًا.", use: "الواجهات، المداخل، الأسطح المنحنية", image: storage.materials, accent: "#b37452" },
  { index: "02", name: "بديل الخشب الخارجي", latin: "WPC / TIMBER", category: "بديل الخشب", description: "إيقاع الخشب وخطوطه يضيفان دفئًا للواجهات المعاصرة والمساحات الخارجية.", use: "الواجهات، الجدران، كاسرات الشمس", image: storage.hero, accent: "#a78158" },
  { index: "03", name: "الصفائح الحجرية المرنة", latin: "STONE / SURFACE", category: "الصفائح الحجرية", description: "حضور الحجر في طبقة رشيقة تمنح الواجهة طابعًا معماريًا متزنًا.", use: "الواجهات، الأعمدة، الجدران الداخلية", image: storage.showcase, accent: "#b9a88e" },
  { index: "04", name: "ألواح HPL والفايبر سمنت", latin: "HPL / CEMENT", category: "HPL", description: "أسطح واضحة وخطوط دقيقة للكتل ذات الطابع الهندسي المعاصر.", use: "الواجهات، الأسقف، تفاصيل المبنى", image: storage.materials, accent: "#4d514e" },
];

const promptSuggestions = [
  "واجهة دافئة",
  "طابع عصري",
  "خطوط عمودية",
  "ألوان رملية",
  "إضاءة مخفية",
  "طابع فاخر",
  "طابع بسيط",
];

const journey = [
  { index: "01", title: "نقرأ المشروع", text: "الموقع، المقاسات، التعرض للشمس، وطبيعة المبنى.", icon: Scan },
  { index: "02", title: "نوازن المواد", text: "لون، ملمس، فواصل، تكلفة، وصيانة على المدى الطويل.", icon: Layers3 },
  { index: "03", title: "نحوّل القرار لتنفيذ", text: "تفاصيل واضحة ومتابعة دقيقة من العينة إلى الواجهة.", icon: Ruler },
];

function SectionMarker({ eyebrow, light = false }: { eyebrow: string; light?: boolean }) {
  return (
    <div className={`section-marker ${light ? "section-marker--light" : ""}`}>
      <b>{eyebrow}</b>
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className={`brand ${compact ? "brand--compact" : ""}`} aria-label="شركة تكسيات — الصفحة الرئيسية">
      <span className="brand-logo"><img src="/images/taxiat-logo-instagram.jpg" alt="شعار TAXIAT تكسيات" width="150" height="150" /></span>
    </a>
  );
}

function ProductCard({ product, selected, favorite, onSelect, onToggleFavorite, onInspect }: { product: Product; selected: boolean; favorite: boolean; onSelect: () => void; onToggleFavorite: () => void; onInspect: () => void }) {
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
          <span className="product-card__code">{product.isCategory ? "حسب الكتالوج" : product.code}</span>
        </span>
      </button>
      <div className="product-card__actions">
        <button type="button" className="inspect-button" onClick={onInspect} aria-label={`معاينة تفاصيل ${product.name}`} title="معاينة التفاصيل"><Info size={15} /></button>
        <button type="button" className={`favorite-button ${favorite ? "favorite-button--active" : ""}`} onClick={onToggleFavorite} aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `حفظ ${product.name} في المفضلة`} title={favorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}><Heart size={13} fill={favorite ? "currentColor" : "none"} /></button>
      </div>
    </div>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
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
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
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
  const [stage, setStage] = useState("التصور جاهز للمراجعة");
  const [generated, setGenerated] = useState(false);
  const [resultIsSimulation, setResultIsSimulation] = useState(false);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      setInspectedProduct(null);
      setShowGuide(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Smart header: transparent over hero, white on scroll
  useEffect(() => {
    const hero = document.querySelector(".hero-section");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderScrolled(!entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Reveal animation
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("حجم الصورة أكبر من 4MB.");
      toast.error("الصورة كبيرة جدًا", { description: "اختر صورة بحجم أقل من 4MB." });
      return;
    }
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setImageFile(file);
    setGeneratedImage(null);
    setGenerated(false);
    setFileName(file.name);
    toast.success("تمت إضافة صورة الواجهة بنجاح", { description: "أدخل المقاسات واختر خامتك للمتابعة." });
  };

  const clearPreview = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageFile(null);
    setGeneratedImage(null);
    setGenerated(false);
    setFileName(null);
    setUploadError(null);
  };

  const toggleFavorite = (code: string) => {
    setFavorites((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
    const product = products.find((item) => item.code === code);
    toast.success(favorites.includes(code) ? `أزيل ${product?.name} من المفضلة` : `حُفظ ${product?.name} في المفضلة`);
  };

  const addPromptChip = (chip: string) => {
    setStylePrompt((current) => {
      const trimmed = current.trim();
      if (!trimmed) return chip;
      if (trimmed.includes(chip)) return trimmed;
      return `${trimmed} · ${chip}`;
    });
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
      const result = await generateVisualization({ image: imageFile, width, height, productCode: selectedProduct.code, productName: selectedProduct.name, stylePrompt }, setStage);
      setGeneratedImage(result.imageUrl);
      setGenerated(true);
      setResultIsSimulation(Boolean(result.isSimulation));
      if (result.isSimulation) {
        toast.info("تم إنشاء المعاينة بنجاح", {
          description: result.note || "معاينة استرشادية جاهزة للمراجعة.",
          duration: 6000,
        });
      } else {
        toast.success("اكتمل التصور بالذكاء الاصطناعي", {
          description: `تم تطبيق ${selectedProduct.name} بنجاح.`,
        });
      }
    } catch (error) {
      toast.error("تعذر إنشاء التصور", { description: error instanceof Error ? error.message : "حاول مرة أخرى بعد قليل." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `taxiat-facade-visualization.${generatedImage.startsWith("data:image/jpeg") ? "jpg" : "png"}`;
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
    toast.success("تم نسخ رابط الإعدادات", { description: "الصورة الناتجة لا تُنقل مع الرابط؛ نزّلها بصورة منفصلة." });
    setShareOpen(false);
  };

  const handleShareChannel = async (channel: "native" | "whatsapp" | "linkedin" | "x") => {
    const url = getShareUrl();
    const text = `إعدادات تصور واجهتي بخامات تكسيات — ${selectedProduct.name}`;
    if (channel === "native" && navigator.share) await navigator.share({ title: "تصوري من تكسيات", text, url });
    else if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
    else if (channel === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
    else if (channel === "x") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
    else await handleCopyShareLink();
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const exploreMaterialInStudio = (index: number) => {
    const family = materialFamilies[index];
    setCategory(family.category);
    const matchingProduct = products.find((product) => product.category === family.category);
    if (matchingProduct) setSelectedProduct(matchingProduct);
    setShowGuide(false);
    scrollTo("studio");
  };

  return (
    <div className="site-shell" dir="rtl" id="top">
      {/* ── HEADER ── */}
      <header className={`site-header ${headerScrolled ? "header--scrolled" : ""}`}>
        <div className="container header-inner">
          <Logo />
          <nav className={`main-nav ${mobileOpen ? "main-nav--open" : ""}`} aria-label="التنقل الرئيسي">
            <button onClick={() => scrollTo("materials")} type="button">الخامات</button>
            <button onClick={() => scrollTo("studio")} type="button">استديو تكسيات الذكي</button>
            <button onClick={() => scrollTo("how-it-works")} type="button">كيف نعمل</button>
            <button onClick={() => scrollTo("contact")} type="button">تواصل معنا</button>
          </nav>
          <div className="header-actions">
            <button className="language-toggle" type="button" onClick={() => toast.info("النسخة الإنجليزية قادمة قريبًا")}>EN</button>
            <button className="button button--small header-cta" type="button" onClick={() => scrollTo("studio")}>
              جرّب الاستديو <ArrowUpLeft size={15} />
            </button>
            <button className="menu-toggle" type="button" onClick={() => setMobileOpen((current) => !current)} aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO SECTION ── */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-backdrop" style={{ backgroundImage: `url(${storage.hero})` }} />
          <div className="hero-scrim" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>استديو الخامات المعمارية</span>
              </div>
              <h1 id="hero-title">تصوّر واجهتك بخامات<br /><span>معمارية فاخرة.</span></h1>
              <p>ارفع صورة مبناك واختبر الخامات المعمارية بالذكاء الاصطناعي بدقة قبل اتخاذ قرار التوريد والتركيب.</p>
              <div className="hero-actions">
                <button className="button button--copper" type="button" onClick={() => scrollTo("studio")}>ابدأ من صورتك <ArrowUpLeft size={17} /></button>
                <button className="button button--outline" type="button" onClick={() => scrollTo("materials")}>استكشف الخامات <ArrowLeft size={16} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="stats-strip" aria-label="مجالات تكسيات">
          <div className="container stats-grid">
            <div className="stat-item"><strong>WPC</strong><span>بديل الخشب المعالج</span></div>
            <div className="stat-item"><strong>HPL</strong><span>ألواح الواجهات الصلبة</span></div>
            <div className="stat-item"><strong>MCM</strong><span>صفائح الطين المعمارية</span></div>
            <div className="stat-item"><strong>STONE</strong><span>الصفائح الحجرية المرنة</span></div>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section className="manifesto-section" id="about" data-reveal>
          <div className="container manifesto-grid">
            <div className="manifesto-label"><SectionMarker eyebrow="رؤية تكسيات" /></div>
            <div className="manifesto-copy">
              <h2>المبنى لا ينتهي عند شكله.<br /><em>الخامة تمنحه</em> إحساسه الأول.</h2>
              <div className="manifesto-bottom"><p>في تكسيات نرى الواجهة تجربة تبدأ من ملمس المادة وتمر بالضوء والظل، لتتحول إلى اختيار معماري يدوم.</p></div>
            </div>
          </div>
        </section>

        {/* ── AI STUDIO WORKSPACE ── */}
        <section className="studio-section" id="studio" data-reveal>
          <div className="container">
            <div className="studio-heading">
              <div><SectionMarker eyebrow="استديو تكسيات الذكي" light /><h2>تخيل الخامة<br /><em>على مبناك.</em></h2></div>
              <div className="studio-intro"><p>ارفع صورتك، حدّد المقاسات والخامة، وقارن النتيجة مباشرة.</p></div>
            </div>
            <div className="studio-layout">
              <div className="studio-panel">
                <div className="studio-steps" aria-label="خطوات الاستديو">
                  <div className={`studio-step ${!preview ? "studio-step--active" : "studio-step--done"}`}><span>01</span><b>الصورة</b></div>
                  <div className={`studio-step ${preview && !isGenerating && !generatedImage ? "studio-step--active" : ""}`}><span>02</span><b>المقاس والخامة</b></div>
                  <div className={`studio-step ${isGenerating ? "studio-step--active" : ""}`}><span>03</span><b>المعالجة</b></div>
                  <div className={`studio-step ${generatedImage ? "studio-step--active" : ""}`}><span>04</span><b>المقارنة</b></div>
                </div>

                <div className="studio-form">
                  {/* Step 1: Upload */}
                  <div className="form-section">
                    <div className="form-section__head"><span>01</span><div><h3>أضف صورة الواجهة</h3><p>صورة أمامية واضحة للفيلا أو المبنى تعطيك نتيجة أدق.</p></div></div>
                    <input ref={fileInputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
                    {!preview ? (
                      <button type="button" className={`upload-zone ${isDragging ? "upload-zone--dragging" : ""}`} onClick={() => fileInputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0]); }}>
                        <span className="upload-icon"><CloudUpload size={22} /></span><strong>أفلت صورة الواجهة هنا</strong><span>أو اضغط للاختيار · JPG / PNG / WebP</span><small>حجم الملف حتى 4MB</small>
                      </button>
                    ) : (
                      <div className={`upload-preview ${isGenerating ? "upload-preview--scanning" : ""}`}>
                        <img src={preview} alt="معاينة صورة الواجهة المرفوعة" />
                        <span className="upload-preview__badge">الصورة الأصلية</span>
                        {isGenerating && <div className="scan-layer" aria-hidden="true"><span className="scan-layer__beam" /><span className="scan-layer__target scan-layer__target--one" /><span className="scan-layer__target scan-layer__target--two" /></div>}
                        <div className="upload-preview__overlay">
                          <span><CheckCircle2 size={14} /> {isGenerating ? stage : fileName}</span>
                          <div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isGenerating}>استبدال</button>
                            <button type="button" onClick={clearPreview} disabled={isGenerating} aria-label="إزالة الصورة"><X size={14} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                    {uploadError && <div className="form-error"><X size={14} /> {uploadError}</div>}
                  </div>

                  {/* Step 2: Dimensions */}
                  <div className="form-section">
                    <div className="form-section__head"><span>02</span><div><h3>مقاس الواجهة التقريبي</h3><p>يكفي تقدير أولي بالأمتار لحساب تناسب الألواح.</p></div></div>
                    <div className="dimensions-grid">
                      <label>العرض<input inputMode="decimal" value={width} onChange={(event) => setWidth(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="18" /><em>متر</em></label>
                      <label>الارتفاع<input inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="9" /><em>متر</em></label>
                    </div>
                  </div>

                  {/* Step 3: Style Prompt & Chips */}
                  <div className="form-section">
                    <div className="form-section__head"><span>03</span><div><h3>وصف النمط المطلوب</h3><p>اختر نمطًا مقترحًا أو اكتب وصفًا خاصًا.</p></div></div>
                    <div className="prompt-chips">
                      {promptSuggestions.map((suggestion) => (
                        <button key={suggestion} type="button" className="prompt-chip-btn" onClick={() => addPromptChip(suggestion)}>+ {suggestion}</button>
                      ))}
                    </div>
                    <textarea className="style-prompt" value={stylePrompt} onChange={(event) => setStylePrompt(event.target.value)} maxLength={240} placeholder="مثال: تطبيق بديل الخشب على الكتلة البارزة مع صفائح طين معالج في المدخل..." aria-label="وصف النمط المطلوب" />
                    <div className="prompt-footer"><small>{stylePrompt.length}/240</small></div>
                  </div>

                  {/* Step 4: Material Selector */}
                  <div className="form-section material-picker" id="studio-selector">
                    <div className="form-section__head"><span>04</span><div><h3>اختر خامة تكسيات</h3></div></div>
                    <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم الخامة أو الكود" aria-label="البحث في خامات تكسيات" /></div>
                    <div className="chip-row">{categories.map((item) => <button type="button" key={item} className={category === item ? "chip chip--active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}<button type="button" className={`chip chip--favorite ${favoritesOnly ? "chip--active" : ""}`} onClick={() => setFavoritesOnly((current) => !current)}><Heart size={12} fill={favoritesOnly ? "currentColor" : "none"} /> المفضلة {favorites.length ? `(${favorites.length})` : ""}</button></div>
                    <div className="selected-product selected-product--featured"><span className="selected-product__image" style={{ background: `linear-gradient(135deg, ${selectedProduct.swatch}, #282923)` }} /><span><strong>{selectedProduct.name}</strong><em>{selectedProduct.category} · {selectedProduct.finish}</em></span><BadgeCheck size={18} /></div>
                    <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.code} product={product} selected={selectedProduct.code === product.code} favorite={favorites.includes(product.code)} onSelect={() => { setSelectedProduct(product); toast.success(`تم اختيار ${product.name}`); }} onToggleFavorite={() => toggleFavorite(product.code)} onInspect={() => setInspectedProduct(product)} />)}</div>
                    {filteredProducts.length === 0 && <div className="empty-state"><Search size={18} /><strong>لا توجد نتائج</strong><span>جرّب اسمًا أو كودًا مختلفًا.</span></div>}
                  </div>

                  {/* Submit Button */}
                  <div className="studio-submit">
                    <button type="button" className="button button--copper button--wide" onClick={runGeneration} disabled={isGenerating}>{isGenerating ? <><RefreshCw className="spin" size={16} /> جارٍ إنشاء التصور...</> : <>أنشئ التصور بالذكاء الاصطناعي <ArrowUpLeft size={16} /></>}</button>
                  </div>
                </div>
              </div>

              {/* Studio Result Panel */}
              <div className="studio-result">
                <div className="result-topline">
                  <span><span className="live-dot live-dot--dark" /> مساحة المعاينة الحية</span>
                  <span className="result-topline-badge">معاينة بالذكاء الاصطناعي · {width || "—"} × {height || "—"} م</span>
                </div>
                {isGenerating ? (
                  <div className="generation-state" role="status" aria-live="polite">
                    <div className="generation-orbit"><span /><span /><span /></div>
                    <p>{stage}</p>
                    <div className="progress-line progress-line--indeterminate"><span /></div>
                  </div>
                ) : generated ? (
                  <>
                    <BeforeAfterViewer before={preview!} after={generatedImage!} beforeAlt="صورة الواجهة الأصلية" afterAlt={resultIsSimulation ? "الصورة الأصلية في وضع المعاينة التجريبية" : `تصور الواجهة بعد تطبيق ${selectedProduct.name}`} />
                    <div className="result-caption">
                      <div>
                        <span>{resultIsSimulation ? "معاينة تجريبية" : "تصور بالذكاء الاصطناعي · اسحب للمقارنة"}</span>
                        <strong>{selectedProduct.name}</strong>
                      </div>
                      <div className="result-actions">
                        <button type="button" onClick={handleDownload} aria-label="تنزيل النتيجة" title="تنزيل النتيجة"><Download size={16} /></button>
                        <button type="button" onClick={runGeneration} aria-label="إعادة التوليد" title="إعادة التوليد"><RefreshCw size={16} /></button>
                        <button type="button" onClick={() => scrollTo("studio-selector")} aria-label="تغيير الخامة" title="تغيير الخامة"><Plus size={17} /></button>
                        <button type="button" onClick={() => setShareOpen((current) => !current)} aria-label="مشاركة إعدادات التصميم" title="مشاركة إعدادات التصميم"><Share2 size={16} /></button>
                      </div>
                    </div>
                    <div className="result-next">
                      <span>جاهز للتنفيذ؟ ناقش التفاصيل والكميات مع مستشار تكسيات.</span>
                      <a href={quoteUrl} target="_blank" rel="noreferrer" className="button button--dark">اطلب تسعيرة لمشروعك <ArrowUpLeft size={16} /></a>
                    </div>
                    {shareOpen && (
                      <div className="share-panel">
                        <div><strong>شارك إعدادات التصميم</strong><span>الرابط ينقل الخامة والمقاسات والوصف.</span></div>
                        <div className="share-options">
                          <button type="button" onClick={handleCopyShareLink}><Link2 size={15} /> نسخ الرابط</button>
                          <button type="button" onClick={() => handleShareChannel("whatsapp")}><MessageCircle size={15} /> واتساب</button>
                          <button type="button" onClick={() => handleShareChannel("x")}><span className="share-x">𝕏</span> X</button>
                          <button type="button" onClick={() => handleShareChannel("linkedin")}><Linkedin size={15} /> LinkedIn</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="result-empty">
                    <img src={preview ?? storage.showcase} alt={preview ? "صورة الواجهة المرفوعة" : "تصور معماري توضيحي"} />
                    <div className="result-empty__content">
                      <Camera size={22} />
                      <strong>{preview ? "صورتك جاهزة للتصور" : "تخيّل واجهتك هنا"}</strong>
                      <span>{preview ? "اختر الخامة ثم أنشئ التصور لمشاهدة النتيجة." : "ارفع صورة مبناك لتظهر المقارنة هنا بالكامل."}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MATERIALS EXPLORER ── */}
        <section className="materials-section" id="materials" data-reveal>
          <div className="container">
            <div className="section-heading-row"><div><SectionMarker eyebrow="مكتبة الخامات" /><h2>اختر الإحساس<br /><em>قبل اللون.</em></h2></div><div className="heading-side"><p>استكشف عائلات المواد وأسطحها، ثم جرّب اختيارك على واجهتك.</p></div></div>
            <div className="material-explorer">
              <div className="material-feature" key={activeMaterial}>
                <img src={materialFamilies[activeMaterial].image} alt={`تصور معماري يوضح ${materialFamilies[activeMaterial].name}`} loading="lazy" />
                <div className="material-feature__caption"><span>{materialFamilies[activeMaterial].latin}</span><strong>{materialFamilies[activeMaterial].name}</strong></div>
              </div>
              <div className="material-index" aria-label="عائلات الخامات">
                {materialFamilies.map((material, index) => <button type="button" key={material.name} className={`material-index__item ${activeMaterial === index ? "material-index__item--active" : ""}`} onClick={() => setActiveMaterial(index)} aria-pressed={activeMaterial === index}><span>{material.index}</span><strong>{material.name}</strong><ArrowUpLeft size={18} /></button>)}
                <div className="material-index__detail"><span>{materialFamilies[activeMaterial].latin}</span><p>{materialFamilies[activeMaterial].description}</p><small>الاستخدام / {materialFamilies[activeMaterial].use}</small><div><button type="button" className="text-button" onClick={() => exploreMaterialInStudio(activeMaterial)}>جرّبها على واجهتك <ArrowUpLeft size={16} /></button><button type="button" className="text-button material-detail-link" onClick={() => setShowGuide(true)}>تفاصيل الخامة <ArrowLeft size={15} /></button></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section" id="how-it-works" data-reveal>
          <div className="container">
            <div className="section-heading-row section-heading-row--light"><div><SectionMarker eyebrow="خطوات العمل" light /><h2>من الفكرة والمحاكاة<br /><em>إلى التركيب والتسليم.</em></h2></div><div className="heading-side"><p>نقدم دراسة معمارية ومخططات تنفيذية وإشرافاً فنياً لضمان أعلى مستويات الجودة.</p><button className="text-button text-button--light" type="button" onClick={() => scrollTo("contact")}>تواصل مع مستشار تكسيات <ArrowLeft size={16} /></button></div></div>
            <div className="journey-grid">{journey.map(({ index, title, text, icon: Icon }, itemIndex) => <div className="journey-card" key={index}><div className="journey-card__top"><span>{index}</span><Icon size={22} strokeWidth={1.3} /></div><div className="journey-card__line"><span style={{ width: `${((itemIndex + 1) / journey.length) * 100}%` }} /></div><h3>{title}</h3><p>{text}</p></div>)}</div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="contact-section" id="contact">
          <div className="contact-visual" style={{ backgroundImage: `url(${storage.hero})` }} /><div className="contact-overlay" />
          <div className="container contact-content"><div><SectionMarker eyebrow="ابدأ مشروعك" light /><h2>جاهز لتحويل<br /><em>الفكرة إلى واجهة؟</em></h2><p>شارك صورة مشروعك والخامة التي اخترتها مع فريق تكسيات، واطلب تسعيرة تناسب احتياجك.</p><a className="button button--copper" href={quoteUrl} target="_blank" rel="noreferrer">اطلب تسعيرة من تكسيات <ArrowUpLeft size={17} /></a></div></div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="container footer-top"><Logo compact /><p>شركة تكسيات — رواد توريد وتركيب تكسيات الواجهات والديكورات الداخلية والخارجية.<br />حلول معمارية مبتكرة تدوم لعقود.</p><div className="footer-links"><div><small>استكشف</small><button type="button" onClick={() => scrollTo("materials")}>الخامات</button><button type="button" onClick={() => scrollTo("studio")}>استديو تكسيات الذكي</button></div><div><small>تواصل</small><a href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer">إنستغرام: @taxiat_co</a><a href="https://taxiat.com.sa" target="_blank" rel="noreferrer">taxiat.com.sa</a><span>المملكة العربية السعودية · دولة الكويت</span></div></div></div>
        <div className="container footer-bottom"><span>© 2026 شركة تكسيات لتكسيات الواجهات والديكور (Taxiat Co.) — جميع الحقوق محفوظة</span><div className="socials"><a href="https://www.instagram.com/taxiat_co/?hl=ar" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href="https://taxiat.com.sa" target="_blank" rel="noreferrer" aria-label="الموقع"><Globe2 size={16} /></a></div><span>الرياض · جدة · الكويت</span></div>
      </footer>

      {/* ── MATERIAL INSPECTION MODAL ── */}
      {inspectedProduct && (
        <div className="modal-backdrop" role="presentation" onClick={() => setInspectedProduct(null)}>
          <div className="material-modal" role="dialog" aria-modal="true" aria-labelledby="product-inspect-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setInspectedProduct(null)} aria-label="إغلاق"><X size={18} /></button>
            <div className="modal-kicker">مواصفات الخامة</div>
            <h2 id="product-inspect-title">{inspectedProduct.name}</h2>
            <p>{inspectedProduct.description || "خامة معمارية معتمدة من تكسيات مخصصة للتكسيات الخارجية وتصميم الواجهات الفاخرة."}</p>
            <div className="modal-swatch-large" style={{ background: `linear-gradient(135deg, ${inspectedProduct.swatch}, #1e201b)` }}>
              <span>الكود: {inspectedProduct.code}</span>
            </div>
            <div className="modal-details">
              <span><small>الفئة</small><strong>{inspectedProduct.category}</strong></span>
              <span><small>التشطيب</small><strong>{inspectedProduct.finish}</strong></span>
              <span><small>الانطباع المعماري</small><strong>{inspectedProduct.tone}</strong></span>
            </div>
            <button type="button" className="button button--copper button--wide" onClick={() => { setSelectedProduct(inspectedProduct); setInspectedProduct(null); toast.success(`تم اختيار ${inspectedProduct.name} للاستديو`); scrollTo("studio"); }}>تحديد هذه الخامة لتصور الواجهة <ArrowUpLeft size={16} /></button>
          </div>
        </div>
      )}

      {/* ── MATERIAL FAMILY MODAL ── */}
      {showGuide && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowGuide(false)}>
          <div className="material-modal" role="dialog" aria-modal="true" aria-labelledby="material-guide-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowGuide(false)} aria-label="إغلاق"><X size={18} /></button>
            <div className="modal-kicker">تكسيات / دليل الخامات</div>
            <h2 id="material-guide-title">{materialFamilies[activeMaterial].name}</h2>
            <p>{materialFamilies[activeMaterial].description}</p>
            <div className="modal-image"><img src={materialFamilies[activeMaterial].image} alt="" /></div>
            <div className="modal-details">
              <span><small>التكوين</small><strong>جودة معتمدة</strong></span>
              <span><small>الطابع</small><strong>فخامة معاصرة</strong></span>
              <span><small>الاستخدام</small><strong>{materialFamilies[activeMaterial].use}</strong></span>
            </div>
            <button type="button" className="button button--dark button--wide" onClick={() => { setShowGuide(false); exploreMaterialInStudio(activeMaterial); }}>جرّب هذه الخامة في الاستديو <ArrowUpLeft size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
