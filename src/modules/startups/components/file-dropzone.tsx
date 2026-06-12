'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const DEFAULT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.docx';

type FileDropzoneProps = {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
};

export function FileDropzone({
  onFilesAdded,
  accept = DEFAULT_ACCEPT,
  multiple = true,
  disabled = false,
  hint = 'PDF (презентация), PNG, JPG, DOCX. До 10 MB на файл.',
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (files.length === 0) return;
    onFilesAdded(files);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragging(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => addFiles(e.target.files ?? [])}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          disabled && 'cursor-not-allowed opacity-50',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-background hover:border-primary/40 hover:bg-primary/[0.02]',
        )}
      >
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            dragging ? 'bg-primary/15 text-primary' : 'bg-surface text-muted',
          )}
        >
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {dragging
              ? 'Отпустите файлы для загрузки'
              : 'Перетащите файлы сюда'}
          </p>
          <p className="mt-1 text-sm text-muted">
            или{' '}
            <span className="font-medium text-primary">нажмите для выбора</span>
          </p>
        </div>
        <p className="max-w-md text-xs text-muted">{hint}</p>
      </button>
    </div>
  );
}
