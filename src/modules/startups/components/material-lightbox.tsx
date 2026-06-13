'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  X,
} from 'lucide-react';
import { PdfCanvasViewer } from '@/modules/startups/components/pdf-canvas-viewer';
import {
  fileUrl,
  getFileKind,
  type StartupFileRecord,
} from '@/shared/lib/file-display';
import { cn } from '@/shared/lib/utils';

type MaterialLightboxProps = {
  files: StartupFileRecord[];
  initialIndex: number;
  onClose: () => void;
};

export function MaterialLightbox({
  files,
  initialIndex,
  onClose,
}: MaterialLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const file = files[index];
  const kind = file ? getFileKind(file) : 'download';

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(files.length - 1, i + 1));
  }, [files.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrev, goNext]);

  if (!file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр материалов проекта"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.originalName}</p>
          <p className="text-xs text-white/60">
            {index + 1} из {files.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
        {files.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className={cn(
              'absolute left-2 z-10 rounded-full border border-white/20 bg-black/50 p-3 text-white transition-colors hover:bg-black/70 disabled:opacity-30 sm:left-4',
            )}
            aria-label="Предыдущий материал"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="flex h-full w-full max-w-5xl items-center justify-center">
          {kind === 'image' && (
            <img
              src={fileUrl(file.id)}
              alt={file.originalName}
              className="max-h-[calc(100vh-10rem)] max-w-full object-contain"
            />
          )}

          {kind === 'pdf' && (
            <div className="max-h-[calc(100vh-10rem)] w-full overflow-auto rounded-lg bg-white p-4">
              <PdfCanvasViewer url={fileUrl(file.id)} />
            </div>
          )}

          {kind === 'download' && (
            <div className="rounded-xl border border-white/20 bg-white/5 px-8 py-12 text-center text-white">
              <FileText className="mx-auto mb-4 h-12 w-12 text-white/70" />
              <p className="mb-2 text-lg font-medium">{file.originalName}</p>
              <p className="mb-6 text-sm text-white/60">
                Предпросмотр недоступен · {Math.round(file.size / 1024)} KB
              </p>
              <a
                href={fileUrl(file.id, false)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                <Download className="h-4 w-4" />
                Скачать файл
              </a>
            </div>
          )}
        </div>

        {files.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            disabled={index === files.length - 1}
            className={cn(
              'absolute right-2 z-10 rounded-full border border-white/20 bg-black/50 p-3 text-white transition-colors hover:bg-black/70 disabled:opacity-30 sm:right-4',
            )}
            aria-label="Следующий материал"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {files.length > 1 && (
        <footer className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
          {files.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors',
                i === index
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20',
              )}
            >
              {f.originalName.length > 24
                ? `${f.originalName.slice(0, 22)}…`
                : f.originalName}
            </button>
          ))}
        </footer>
      )}
    </div>
  );
}
