'use client';

import { useRef, useState } from 'react';
import { createStartupAction } from '@/modules/startups/actions/startups';
import { isImageMime } from '@/shared/lib/upload';
import { StartupForm } from '@/modules/startups/components/startup-form';
import {
  StartupDraftPreview,
  type DraftFile,
} from '@/modules/startups/components/startup-draft-preview';

type CreateStartupFlowProps = {
  authorName: string;
};

function buildDraftFiles(formData: FormData): DraftFile[] {
  const files = formData
    .getAll('files')
    .filter((f): f is File => f instanceof File && f.size > 0);
  const primaryRaw = formData.get('primaryFileIndex');
  const primaryIndex =
    primaryRaw !== null && primaryRaw !== '' ? Number(primaryRaw) : -1;

  return files.map((file, index) => ({
    file,
    previewUrl: isImageMime(file.type) ? URL.createObjectURL(file) : null,
    isPrimary: Number.isFinite(primaryIndex) && index === primaryIndex,
  }));
}

export function CreateStartupFlow({ authorName }: CreateStartupFlowProps) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const pendingFormDataRef = useRef<FormData | null>(null);
  const [draftFiles, setDraftFiles] = useState<DraftFile[]>([]);
  const [previewData, setPreviewData] = useState<{
    title: string;
    description: string;
  } | null>(null);

  function revokeDraftUrls(files: DraftFile[]) {
    for (const item of files) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
  }

  function handleRequestPreview(formData: FormData) {
    revokeDraftUrls(draftFiles);

    const nextDraftFiles = buildDraftFiles(formData);
    setDraftFiles(nextDraftFiles);
    pendingFormDataRef.current = formData;

    setPreviewData({
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
    });
    setStep('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToForm() {
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handlePublish() {
    const formData = pendingFormDataRef.current;
    if (!formData) return;
    await createStartupAction(formData);
  }

  return (
    <>
      <div className={step === 'form' ? undefined : 'hidden'} aria-hidden={step !== 'form'}>
        <StartupForm
          action={createStartupAction}
          submitLabel="Предпросмотр"
          singleSubmit
          onRequestPreview={handleRequestPreview}
        />
      </div>

      {step === 'preview' && previewData && (
        <StartupDraftPreview
          title={previewData.title}
          description={previewData.description}
          authorName={authorName}
          files={draftFiles}
          onBack={handleBackToForm}
          onPublish={handlePublish}
        />
      )}
    </>
  );
}
