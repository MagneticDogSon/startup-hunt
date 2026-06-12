'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import {
  loadPdfJs,
  type PDFDocumentProxy,
} from '@/modules/startups/lib/load-pdfjs';
import { Button } from '@/shared/components/ui/button';

type DraftPresentationViewerProps = {
  url: string;
  originalName: string;
};

export function DraftPresentationViewer({
  url,
  originalName,
}: DraftPresentationViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const pdfjsLib = await loadPdfJs();
        const task = pdfjsLib.getDocument({ url });
        const pdf = await task.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setPage(1);
      } catch {
        if (!cancelled) setError('Не удалось загрузить презентацию');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      pdfRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    async function renderPage() {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas || page < 1) return;

      const pdfPage = await pdf.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1.5 });
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await pdfPage.render({ canvasContext: context, viewport, canvas }).promise;
    }

    if (!loading && !error) renderPage();
  }, [page, loading, error]);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          <span className="truncate">{originalName}</span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
            Презентация
          </span>
        </div>
        {numPages > 0 && (
          <span className="text-xs text-muted">
            Слайд {page} из {numPages}
          </span>
        )}
      </div>

      <div className="flex min-h-[320px] items-center justify-center overflow-auto rounded-md bg-background">
        {loading && <p className="text-sm text-muted">Загрузка презентации...</p>}
        {error && <p className="text-sm text-error">{error}</p>}
        {!loading && !error && (
          <canvas ref={canvasRef} className="max-w-full" />
        )}
      </div>

      {numPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= numPages}
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
          >
            Далее
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
