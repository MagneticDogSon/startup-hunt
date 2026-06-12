'use client';

import { FileText } from 'lucide-react';
import { PdfCanvasViewer } from '@/modules/startups/components/pdf-canvas-viewer';
import { fileUrl } from '@/shared/lib/file-display';

type PresentationViewerProps = {
  file: { id: string; originalName: string };
  onOpen?: () => void;
};

export function PresentationViewer({ file, onOpen }: PresentationViewerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border border-border bg-surface p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          <span className="truncate">{file.originalName}</span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
            Презентация
          </span>
        </div>
        <span className="text-xs text-muted">Нажмите для просмотра</span>
      </div>

      <div
        className="pointer-events-none rounded-md bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <PdfCanvasViewer url={fileUrl(file.id)} compact />
      </div>
    </button>
  );
}
