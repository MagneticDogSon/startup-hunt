import { registerFounderAction } from '@/modules/auth/actions/auth';
import { RegisterForm } from '@/modules/auth/components/register-form';

export default async function FounderRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <RegisterForm
      title="Регистрация основателя"
      description="Создайте аккаунт, чтобы подать карточку стартапа. Администратор подтвердит роль «Основатель» и откроет доступ к публикации."
      action={registerFounderAction}
      error={params.error}
    />
  );
}
