import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(100),
  email: z.string().email('Некорректный email'),
  password: z
    .string()
    .min(10, 'Минимум 10 символов')
    .regex(/[a-zA-Z]/, 'Нужна хотя бы одна буква')
    .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
});

export const LoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const CreateStartupSchema = z.object({
  title: z.string().min(1, 'Введите название').max(100),
  description: z.string().min(10, 'Минимум 10 символов').max(5000),
});

export const VoteSchema = z.object({
  startupId: z.string(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export const CommentSchema = z.object({
  startupId: z.string(),
  body: z.string().min(1, 'Комментарий не может быть пустым').max(2000),
});

export const DeleteCommentSchema = z.object({
  startupId: z.string(),
});

export const CommentReplySchema = z.object({
  commentId: z.string(),
  body: z.string().min(1, 'Ответ не может быть пустым').max(2000),
});

export const DeleteCommentReplySchema = z.object({
  commentId: z.string(),
});

export const ChangeRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['PENDING', 'FOUNDER', 'EVALUATOR', 'ADMIN']),
});

export const CreateEvaluatorSchema = RegisterSchema;
