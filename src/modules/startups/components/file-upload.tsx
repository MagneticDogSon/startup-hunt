'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { FileDropzone } from '@/modules/startups/components/file-dropzone';
import { isPdfMime } from '@/shared/lib/upload';

export function FileUpload({ startupId }: { startupId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(-1);

  function addFiles(list: File[]) {
    if (list.length === 0) return;

    setSelectedFiles((prev) => {
      const next = [...prev, ...list];
      const firstPdf = next.findIndex((f) => isPdfMime(f.type));
      if (primaryIndex < 0 && firstPdf >= 0) {
        setPrimaryIndex(firstPdf);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('startupId', startupId);
    selectedFiles.forEach((f) => formData.append('files', f));
    if (primaryIndex >= 0) {
      formData.set('primaryFileIndex', String(primaryIndex));
    }

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Ошибка загрузки');
      } else {
        setSelectedFiles([]);
        setPrimaryIndex(-1);
        router.refresh();
      }
    } catch {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FileDropzone
        onFilesAdded={addFiles}
        disabled={loading}
        hint="PDF, PNG, JPG, DOCX. До 10 MB на файл."
      />

      {selectedFiles.length > 0 && (
        <ul className="space-y-2">
          {selectedFiles.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              {isPdfMime(file.type) && <FileText className="h-4 w-4 text-primary" />}
              <span className="flex-1 truncate">{file.name}</span>
              {isPdfMime(file.type) && (
                <label className="flex items-center gap-1 text-xs text-muted">
                  <input
                    type="radio"
                    checked={primaryIndex === index}
                    onChange={() => setPrimaryIndex(index)}
                  />
                  Презентация
                </label>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" disabled={loading || selectedFiles.length === 0} size="sm">
        {loading ? 'Загрузка...' : 'Загрузить файлы'}
      </Button>
    </form>
  );
}
