'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { ImageCarousel } from '@/modules/startups/components/image-carousel';
import { MaterialLightbox } from '@/modules/startups/components/material-lightbox';
import { PresentationViewer } from '@/modules/startups/components/presentation-viewer';
import {
  galleryIndexForFile,
  orderedGalleryFiles,
  partitionFiles,
  type StartupFileRecord,
} from '@/shared/lib/file-display';

export function StartupFilesDisplay({
  files,
}: {
  files: StartupFileRecord[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = orderedGalleryFiles(files);
  const { primary, images, attachments } = partitionFiles(files);

  function openFile(fileId: string) {
    setLightboxIndex(galleryIndexForFile(files, fileId));
  }

  if (files.length === 0) {
    return <p className="text-sm text-muted">Файлы не прикреплены</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {primary && (
          <section>
            <PresentationViewer
              file={primary}
              onOpen={() => openFile(primary.id)}
            />
          </section>
        )}

        {images.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-medium text-muted">
              Изображения {images.length > 1 ? `(${images.length})` : ''}
            </h3>
            <ImageCarousel images={images} onImageClick={openFile} />
          </section>
        )}

        {attachments.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-medium text-muted">
              Другие файлы
            </h3>
            <ul className="space-y-2">
              {attachments.map((file) => (
                <li key={file.id}>
                  <button
                    type="button"
                    onClick={() => openFile(file.id)}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    {file.originalName}
                  </button>
                  <span className="ml-2 text-xs text-muted">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {lightboxIndex !== null && gallery.length > 0 && (
        <MaterialLightbox
          files={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
