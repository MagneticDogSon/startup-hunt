'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  loadPdfJs,
  type PDFDocumentProxy,
} from '@/modules/startups/lib/load-pdfjs';
import { Button } from '@/shared/components/ui/button';

type PdfCanvasViewerProps = {
  url: string;
  compact?: boolean;
  className?: string;
};

export function PdfCanvasViewer({
  url,
  compact = false,
  className,
}: PdfCanvasViewerProps) {
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
      setPage(1);
      try {
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
      } catch {
        if (!cancelled) setError('Не удалось загрузить PDF');
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
      if (!pdf || !canvas || page < 1 || loading || error) return;

      const pdfPage = await pdf.getPage(page);
      const scale = compact ? 1.5 : 2;
      const viewport = pdfPage.getViewport({ scale });
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await pdfPage.render({ canvasContext: context, viewport, canvas }).promise;
    }

    renderPage();
  }, [page, loading, error, compact]);

  const minH = compact ? 'min-h-[320px]' : 'min-h-[50vh]';

  return (
    <div className={className}>
      <div
        className={`flex ${minH} items-center justify-center overflow-auto`}
      >
        {loading && <p className="text-sm text-muted">Загрузка…</p>}
        {error && <p className="text-sm text-error">{error}</p>}
        {!loading && !error && (
          <canvas ref={canvasRef} className="max-h-full max-w-full" />
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
          <span className="text-xs text-muted">
            Слайд {page} / {numPages}
          </span>
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
