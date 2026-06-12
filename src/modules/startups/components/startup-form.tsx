'use client';



import { useId, useRef, useState } from 'react';

import { FileText, ImageIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { Input } from '@/shared/components/ui/input';

import { Label } from '@/shared/components/ui/label';

import { Textarea } from '@/shared/components/ui/textarea';

import { FileDropzone } from '@/modules/startups/components/file-dropzone';

import { fileUrl, type StartupFileRecord } from '@/shared/lib/file-display';

import { isImageMime, isPdfMime } from '@/shared/lib/upload';



export function StartupForm({

  action,

  defaultValues,

  existingFiles = [],

  submitLabel,

  singleSubmit = false,

  onRequestPreview,

}: {

  action: (formData: FormData) => Promise<void>;

  defaultValues?: { title: string; description: string };

  existingFiles?: StartupFileRecord[];

  submitLabel: string;

  /** Блокирует повторную отправку при создании (одна запись на одну попытку). */

  singleSubmit?: boolean;

  /** Если задан — первая отправка открывает предпросмотр вместо публикации. */

  onRequestPreview?: (formData: FormData) => void;

}) {

  const formId = useId();

  const submissionIdRef = useRef(

    singleSubmit && typeof crypto !== 'undefined' && 'randomUUID' in crypto

      ? crypto.randomUUID()

      : null,

  );

  const submittingRef = useRef(false);



  const initialPrimaryExisting =

    existingFiles.find((f) => f.isPrimary && isPdfMime(f.mimeType))?.id ??

    existingFiles.find((f) => isPdfMime(f.mimeType))?.id ??

    null;



  const [keptExistingFiles, setKeptExistingFiles] =

    useState<StartupFileRecord[]>(existingFiles);

  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [primaryExistingId, setPrimaryExistingId] = useState<string | null>(

    initialPrimaryExisting,

  );

  const [primaryNewIndex, setPrimaryNewIndex] = useState(-1);

  const [isSubmitting, setIsSubmitting] = useState(false);



  function addFiles(list: File[]) {

    if (list.length === 0) return;



    setNewFiles((prev) => [...prev, ...list]);

    setNewPreviews((prev) => [

      ...prev,

      ...list.map((f) => (isImageMime(f.type) ? URL.createObjectURL(f) : '')),
    ]);



    if (primaryExistingId === null && primaryNewIndex < 0) {

      const firstPdf = list.findIndex((f) => isPdfMime(f.type));

      if (firstPdf >= 0) {

        setPrimaryNewIndex(newFiles.length + firstPdf);

      }

    }

  }



  function removeNewFile(index: number) {

    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);



    setNewFiles((prev) => prev.filter((_, i) => i !== index));

    setNewPreviews((prev) => prev.filter((_, i) => i !== index));



    if (primaryNewIndex === index) {

      setPrimaryNewIndex(-1);

    } else if (primaryNewIndex > index) {

      setPrimaryNewIndex(primaryNewIndex - 1);

    }

  }



  function removeExistingFile(id: string) {

    setKeptExistingFiles((prev) => prev.filter((f) => f.id !== id));

    setRemovedFileIds((prev) => [...prev, id]);



    if (primaryExistingId === id) {

      setPrimaryExistingId(null);

    }

  }



  function selectPrimaryExisting(id: string) {

    setPrimaryExistingId(id);

    setPrimaryNewIndex(-1);

  }



  function selectPrimaryNew(index: number) {

    setPrimaryNewIndex(index);

    setPrimaryExistingId(null);

  }



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (submittingRef.current) return;



    submittingRef.current = true;

    setIsSubmitting(true);



    const form = e.currentTarget;

    const formData = new FormData();

    formData.set('title', (form.elements.namedItem('title') as HTMLInputElement).value);

    formData.set(

      'description',

      (form.elements.namedItem('description') as HTMLTextAreaElement).value,

    );

    newFiles.forEach((f) => formData.append('files', f));



    if (removedFileIds.length > 0) {

      formData.set('removedFileIds', JSON.stringify(removedFileIds));

    }

    if (primaryExistingId) {

      formData.set('primaryFileId', primaryExistingId);

    }

    if (primaryNewIndex >= 0) {
      const primaryField =
        existingFiles.length > 0 || removedFileIds.length > 0
          ? 'primaryNewFileIndex'
          : 'primaryFileIndex';
      formData.set(primaryField, String(primaryNewIndex));
    }

    if (submissionIdRef.current) {

      formData.set('submissionId', submissionIdRef.current);

    }



    try {

      if (onRequestPreview) {

        onRequestPreview(formData);

        submittingRef.current = false;

        setIsSubmitting(false);

        return;

      }

      await action(formData);

    } catch {

      submittingRef.current = false;

      setIsSubmitting(false);

    }

  }



  const hasFiles = keptExistingFiles.length > 0 || newFiles.length > 0;



  return (

    <form

      id={formId}

      onSubmit={handleSubmit}

      className="max-w-2xl space-y-6"

      aria-busy={isSubmitting}

    >

      <div className="space-y-2">

        <Label htmlFor="title">Название</Label>

        <Input

          id="title"

          name="title"

          defaultValue={defaultValues?.title}

          required

          maxLength={100}

          disabled={isSubmitting}

        />

      </div>



      <div className="space-y-2">

        <Label htmlFor="description">Описание</Label>

        <Textarea

          id="description"

          name="description"

          defaultValue={defaultValues?.description}

          required

          minLength={10}

          maxLength={5000}

          disabled={isSubmitting}

        />

      </div>



      <div className="space-y-3">

        <Label>Файлы проекта</Label>

        <FileDropzone

          onFilesAdded={addFiles}

          disabled={isSubmitting}

          hint="PDF (презентация), PNG, JPG, DOCX. До 10 MB на файл. Можно добавлять файлы несколькими выборами и убирать ненужные перед сохранением."

        />



        {hasFiles && (

          <ul className="space-y-2">

            {keptExistingFiles.map((file) => (

              <li

                key={file.id}

                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"

              >

                {isImageMime(file.mimeType) ? (

                  <img

                    src={fileUrl(file.id)}

                    alt=""

                    className="h-14 w-14 shrink-0 rounded-md object-cover"

                  />

                ) : isPdfMime(file.mimeType) ? (

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">

                    <FileText className="h-6 w-6" />

                  </div>

                ) : (

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-background text-muted">

                    <ImageIcon className="h-6 w-6" />

                  </div>

                )}



                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-medium">{file.originalName}</p>

                  <p className="text-xs text-muted">

                    {Math.round(file.size / 1024)} KB · уже загружен

                  </p>

                  {isPdfMime(file.mimeType) && (

                    <label className="mt-1 flex items-center gap-2 text-xs text-muted">

                      <input

                        type="radio"

                        name="primaryPicker"

                        checked={primaryExistingId === file.id}

                        onChange={() => selectPrimaryExisting(file.id)}

                      />

                      Главная презентация

                    </label>

                  )}

                </div>



                <button

                  type="button"

                  onClick={() => removeExistingFile(file.id)}

                  className="text-xs text-muted hover:text-error"

                >

                  Убрать

                </button>

              </li>

            ))}



            {newFiles.map((file, index) => (

              <li

                key={`${file.name}-${index}-${file.lastModified}`}

                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"

              >

                {newPreviews[index] ? (

                  <img

                    src={newPreviews[index]}

                    alt=""

                    className="h-14 w-14 shrink-0 rounded-md object-cover"

                  />

                ) : isPdfMime(file.type) ? (

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">

                    <FileText className="h-6 w-6" />

                  </div>

                ) : (

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-background text-muted">

                    <ImageIcon className="h-6 w-6" />

                  </div>

                )}



                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-medium">{file.name}</p>

                  <p className="text-xs text-muted">

                    {Math.round(file.size / 1024)} KB · новый

                  </p>

                  {isPdfMime(file.type) && (

                    <label className="mt-1 flex items-center gap-2 text-xs text-muted">

                      <input

                        type="radio"

                        name="primaryPicker"

                        checked={primaryNewIndex === index}

                        onChange={() => selectPrimaryNew(index)}

                      />

                      Главная презентация

                    </label>

                  )}

                </div>



                <button

                  type="button"

                  onClick={() => removeNewFile(index)}

                  className="text-xs text-muted hover:text-error"

                >

                  Убрать

                </button>

              </li>

            ))}

          </ul>

        )}

      </div>



      <Button type="submit" disabled={isSubmitting}>

        {isSubmitting

          ? submitLabel === 'Создать'

            ? 'Создание…'

            : submitLabel === 'Предпросмотр'

              ? 'Загрузка…'

              : 'Сохранение…'

          : submitLabel}

      </Button>

    </form>

  );

}


