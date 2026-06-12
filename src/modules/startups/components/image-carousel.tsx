'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fileUrl } from '@/shared/lib/file-display';

type ImageFile = {
  id: string;
  originalName: string;
};

export function ImageCarousel({
  images,
  onImageClick,
}: {
  images: ImageFile[];
  onImageClick?: (fileId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  function scrollTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActive(index);
  }

  function shift(delta: number) {
    const next = Math.max(0, Math.min(images.length - 1, active + delta));
    scrollTo(next);
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-lg pb-2"
          onScroll={() => {
            const el = scrollRef.current;
            if (!el || el.children.length === 0) return;
            const center = el.scrollLeft + el.clientWidth / 2;
            let closest = 0;
            let minDist = Infinity;
            Array.from(el.children).forEach((child, i) => {
              const node = child as HTMLElement;
              const childCenter = node.offsetLeft + node.offsetWidth / 2;
              const dist = Math.abs(center - childCenter);
              if (dist < minDist) {
                minDist = dist;
                closest = i;
              }
            });
            setActive(closest);
          }}
        >
          {images.map((img) => (
            <figure
              key={img.id}
              className="w-[min(100%,520px)] shrink-0 snap-center"
            >
              <button
                type="button"
                onClick={() => onImageClick?.(img.id)}
                className="block w-full cursor-pointer rounded-lg border border-border bg-background transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <img
                  src={fileUrl(img.id)}
                  alt={img.originalName}
                  className="pointer-events-none h-72 w-full object-contain"
                />
              </button>
              <figcaption className="mt-2 truncate text-center text-xs text-muted">
                {img.originalName}
              </figcaption>
            </figure>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее изображение"
              onClick={() => shift(-1)}
              disabled={active === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2 shadow-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Следующее изображение"
              onClick={() => shift(1)}
              disabled={active === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2 shadow-sm disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Изображение ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
