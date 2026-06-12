'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

export type CommentReply = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
};

export type StartupComment = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
  reply: CommentReply | null;
};

type StartupCommentsProps = {
  startupId: string;
  comments: StartupComment[];
  canComment: boolean;
  canReply: boolean;
  currentUserId: string;
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function wasEdited(createdAt: string, updatedAt: string) {
  return (
    updatedAt !== createdAt &&
    new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000
  );
}

function CommentReplyForm({
  commentId,
  initialBody,
  onSaved,
}: {
  commentId: string;
  initialBody: string;
  onSaved: (reply: CommentReply | null) => void;
}) {
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!!initialBody);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmed = body.trim();
    if (!trimmed) {
      setError('Введите текст ответа');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, body: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Не удалось сохранить ответ');
        return;
      }

      const data = await res.json();
      onSaved(data.reply as CommentReply);
      setExpanded(true);
    } catch {
      setError('Не удалось сохранить ответ');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments/replies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Не удалось удалить ответ');
        return;
      }

      setBody('');
      setExpanded(false);
      onSaved(null);
    } catch {
      setError('Не удалось удалить ответ');
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-3 h-8 px-2 text-muted hover:text-primary"
        onClick={() => setExpanded(true)}
      >
        Ответить
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-l-2 border-primary/30 pl-4">
      <p className="text-xs font-medium text-muted">Ваш ответ</p>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Напишите ответ проверяющему…"
        maxLength={2000}
        disabled={loading}
        className="min-h-[80px]"
        aria-label="Ответ на комментарий"
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Сохранение…' : initialBody ? 'Обновить ответ' : 'Отправить ответ'}
        </Button>
        {initialBody && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleDelete}
          >
            Удалить ответ
          </Button>
        )}
        {!initialBody && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => {
              setBody('');
              setExpanded(false);
              setError(null);
            }}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}

export function StartupComments({
  startupId,
  comments: initialComments,
  canComment,
  canReply,
  currentUserId,
}: StartupCommentsProps) {
  const router = useRouter();
  const initialOwnComment = initialComments.find(
    (c) => c.user.id === currentUserId,
  );

  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState('');
  const [editing, setEditing] = useState(!initialOwnComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownComment = comments.find((c) => c.user.id === currentUserId);

  function updateCommentReply(commentId: string, reply: CommentReply | null) {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, reply } : c)),
    );
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canComment || loading) return;

    const trimmed = body.trim();
    if (!trimmed) {
      setError('Введите текст комментария');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, body: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Не удалось сохранить комментарий');
        return;
      }

      const data = await res.json();
      const saved = data.comment as StartupComment;

      setComments((prev) => {
        const withoutOwn = prev.filter((c) => c.user.id !== currentUserId);
        return [
          ...withoutOwn,
          { ...saved, reply: saved.reply ?? null },
        ].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
      setBody('');
      setEditing(false);
      router.refresh();
    } catch {
      setError('Не удалось сохранить комментарий');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!canComment || loading || !ownComment) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Не удалось удалить комментарий');
        return;
      }

      setComments((prev) => prev.filter((c) => c.user.id !== currentUserId));
      setBody('');
      setEditing(true);
      router.refresh();
    } catch {
      setError('Не удалось удалить комментарий');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="comments" className="border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-semibold">
        Комментарии проверяющих
        {comments.length > 0 && (
          <span className="ml-2 text-base font-normal text-muted">
            ({comments.length})
          </span>
        )}
      </h2>

      {canComment && ownComment && !editing && (
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setBody(ownComment.body);
              setError(null);
              setEditing(true);
            }}
          >
            Редактировать комментарий
          </Button>
        </div>
      )}

      {canComment && editing && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Оставьте свой отзыв о стартапе…"
            maxLength={2000}
            disabled={loading}
            aria-label="Комментарий проверяющего"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              {loading
                ? 'Сохранение…'
                : ownComment
                  ? 'Обновить комментарий'
                  : 'Оставить комментарий'}
            </Button>
            {ownComment && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={handleDelete}
              >
                Удалить
              </Button>
            )}
            {ownComment && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => {
                  setBody('');
                  setError(null);
                  setEditing(false);
                }}
              >
                Отмена
              </Button>
            )}
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted">
          {canComment
            ? 'Пока нет комментариев. Будьте первым, кто оставит отзыв.'
            : canReply
              ? 'Проверяющие ещё не оставили комментариев. Вы сможете ответить, когда они появятся.'
              : 'Проверяющие ещё не оставили комментариев.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const isOwn = comment.user.id === currentUserId;

            return (
              <li
                key={comment.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium">
                    {comment.user.name}
                    {isOwn && (
                      <span className="ml-2 text-xs font-normal text-muted">
                        (вы)
                      </span>
                    )}
                    <span className="ml-2 text-xs font-normal text-muted">
                      · проверяющий
                    </span>
                  </p>
                  <time
                    className="text-xs text-muted"
                    dateTime={comment.updatedAt}
                  >
                    {formatDateTime(comment.updatedAt)}
                    {wasEdited(comment.createdAt, comment.updatedAt) &&
                      ' · изменён'}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {comment.body}
                </p>

                {comment.reply && !canReply && (
                  <div className="mt-4 border-l-2 border-primary/30 pl-4">
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium">
                        {comment.reply.user.name}
                        <span className="ml-2 text-xs font-normal text-muted">
                          · автор
                        </span>
                      </p>
                      <time
                        className="text-xs text-muted"
                        dateTime={comment.reply.updatedAt}
                      >
                        {formatDateTime(comment.reply.updatedAt)}
                        {wasEdited(
                          comment.reply.createdAt,
                          comment.reply.updatedAt,
                        ) && ' · изменён'}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {comment.reply.body}
                    </p>
                  </div>
                )}

                {canReply && (
                  <CommentReplyForm
                    commentId={comment.id}
                    initialBody={comment.reply?.body ?? ''}
                    onSaved={(reply) => updateCommentReply(comment.id, reply)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
