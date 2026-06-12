'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DraftPresentationViewer } from '@/modules/startups/components/draft-presentation-viewer';
import { Button } from '@/shared/components/ui/button';
import { isImageMime, isPdfMime } from '@/shared/lib/upload';

export type DraftFile = {
  file: File;
  previewUrl: string | null;
  isPrimary: boolean;
};

type StartupDraftPreviewProps = {
  title: string;
  description: string;
  authorName: string;
  files: DraftFile[];
  onBack: () => void;
  onPublish: () => Promise<void>;
};

function partitionDraftFiles(files: DraftFile[]) {
  const primary =
    files.find((f) => f.isPrimary && isPdfMime(f.file.type)) ??
    files.find((f) => isPdfMime(f.file.type));
  const images = files.filter((f) => isImageMime(f.file.type));
  const attachments = files.filter(
    (f) => f !== primary && !isImageMime(f.file.type),
  );
  return { primary, images, attachments };
}

function DraftImageCarousel({
  images,
}: {
  images: { previewUrl: string; originalName: string }[];
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
              key={img.originalName}
              className="w-[min(100%,520px)] shrink-0 snap-center"
            >
              <img
                src={img.previewUrl}
                alt={img.originalName}
                className="h-72 w-full rounded-lg border border-border bg-background object-contain"
              />
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
              key={img.originalName}
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

export function StartupDraftPreview({
  title,
  description,
  authorName,
  files,
  onBack,
  onPublish,
}: StartupDraftPreviewProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { primary, images, attachments } = useMemo(
    () => partitionDraftFiles(files),
    [files],
  );

  const primaryUrl = useMemo(() => {
    if (!primary) return null;
    return URL.createObjectURL(primary.file);
  }, [primary]);

  useEffect(() => {
    return () => {
      if (primaryUrl) URL.revokeObjectURL(primaryUrl);
    };
  }, [primaryUrl]);

  async function handlePublish() {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      await onPublish();
    } catch {
      setIsPublishing(false);
    }
  }

  const carouselImages = images
    .filter((f): f is DraftFile & { previewUrl: string } => f.previewUrl !== null)
    .map((f) => ({
      previewUrl: f.previewUrl,
      originalName: f.file.name,
    }));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Предпросмотр карточки
        </p>
        <p className="text-sm text-muted">
          Так будет выглядеть ваш стартап после публикации. Проверьте данные и
          подтвердите или вернитесь к редактированию.
        </p>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">
            {authorName} ·{' '}
            {new Intl.DateTimeFormat('ru-RU').format(new Date())}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          0
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Материалы проекта</h2>
        {files.length === 0 ? (
          <p className="text-sm text-muted">Файлы не прикреплены</p>
        ) : (
          <div className="space-y-8">
            {primary && primaryUrl && (
              <section>
                <DraftPresentationViewer
                  url={primaryUrl}
                  originalName={primary.file.name}
                />
              </section>
            )}

            {carouselImages.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-medium text-muted">
                  Изображения{' '}
                  {carouselImages.length > 1
                    ? `(${carouselImages.length})`
                    : ''}
                </h3>
                <DraftImageCarousel images={carouselImages} />
              </section>
            )}

            {attachments.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-medium text-muted">
                  Другие файлы
                </h3>
                <ul className="space-y-2">
                  {attachments.map((item) => (
                    <li key={item.file.name}>
                      <span className="text-sm text-primary">
                        {item.file.name}
                      </span>
                      <span className="ml-2 text-xs text-muted">
                        ({Math.round(item.file.size / 1024)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPublishing}
        >
          ← Вернуться к редактированию
        </Button>
        <Button type="button" onClick={handlePublish} disabled={isPublishing}>
          {isPublishing ? 'Публикация…' : 'Опубликовать'}
        </Button>
      </div>
    </div>
  );
}
