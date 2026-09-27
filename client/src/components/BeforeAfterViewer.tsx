import { useEffect, useRef, useState } from "react";
import { Maximize2, MoveHorizontal } from "lucide-react";

type BeforeAfterViewerProps = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export default function BeforeAfterViewer({
  before,
  after,
  beforeAlt,
  afterAlt,
}: BeforeAfterViewerProps) {
  const [position, setPosition] = useState(52);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && event.key === "Escape") {
        setIsFullscreen(false);
      }
      if (event.key === "ArrowLeft") {
        setPosition((current) => Math.min(95, current + 5));
      } else if (event.key === "ArrowRight") {
        setPosition((current) => Math.max(5, current - 5));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const updatePosition = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPosition(next);
  };

  return (
    <div className={isFullscreen ? "viewer-shell viewer-shell--fullscreen" : "viewer-shell"}>
      <div
        ref={frameRef}
        className="before-after"
        onPointerMove={(event) => event.buttons === 1 && updatePosition(event.clientX)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updatePosition(event.clientX);
        }}
        tabIndex={0}
        role="region"
        aria-label="مقارنة تفاعلية بين الواجهة قبل وبعد تطبيق الخامة. استخدم المفاتيح يمين ويسار للتحكم."
      >
        <img className="before-after__image" src={before} alt={beforeAlt} draggable={false} />
        <div className="before-after__after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img className="before-after__image" src={after} alt={afterAlt} draggable={false} />
        </div>
        <div className="before-after__label before-after__label--before">BEFORE · قبل</div>
        <div className="before-after__label before-after__label--after">AFTER · بعد</div>
        <div className="before-after__hint" aria-hidden="true">
          <span>اسحب للمقارنة</span>
        </div>
        <div className="before-after__handle" style={{ left: `${position}%` }} aria-hidden="true">
          <span><MoveHorizontal size={15} strokeWidth={1.7} /></span>
        </div>
      </div>
      <div className="viewer-controls">
        <label className="sr-only" htmlFor="comparison-slider">موضع المقارنة</label>
        <input
          id="comparison-slider"
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="حرّك الفاصل لمقارنة قبل وبعد"
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => setIsFullscreen((current) => !current)}
          aria-label={isFullscreen ? "إغلاق ملء الشاشة" : "تكبير المقارنة"}
          title={isFullscreen ? "إغلاق ملء الشاشة" : "تكبير المقارنة"}
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </div>
  );
}
