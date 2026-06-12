'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  SquarePen,
  TrendingUp,
  Users,
} from 'lucide-react';
import { BrandLogo } from '@/shared/components/brand-logo';
import { LandingMobileNav } from '@/modules/landing/components/landing-mobile-nav';
import { LANDING_MOCK_STARTUPS } from '@/modules/landing/lib/mock-startups';
import { cn } from '@/shared/lib/utils';

const navLinks = [
  { href: '#how-it-works', label: 'Как это работает' },
  { href: '#audiences', label: 'Для кого' },
  { href: '#features', label: 'Преимущества' },
];

const features = [
  {
    icon: TrendingUp,
    title: 'Прозрачный рейтинг',
    text: 'Каждый верифицированный оценщик обладает только одним голосом ▲/▼ на один стартап. Общий балл формируется динамически и виден всем пользователям.',
  },
  {
    icon: FileText,
    title: 'Всё в одной карточке',
    text: 'Информация структурирована на одной странице с возможностью скачать презентацию (PDF), картинки, архивы или финансовую модель.',
  },
  {
    icon: Users,
    title: 'Роли под сценарий',
    text: 'Разграничение прав: фаундеры могут только выставлять или отвечать, оценщики — ставить оценку и вносить правки.',
  },
  {
    icon: MessageSquare,
    title: 'Живой диалог экспертов',
    text: 'Комментарии в древовидном формате — оценщик задаёт вопрос, а основатель стартапа оперативно отвечает прямо под карточкой.',
  },
  {
    icon: Search,
    title: 'Умная таблица с поиском',
    text: 'Мгновенный поиск стартапов по авторам или ключевым словам, удобная сортировка по популярности и свежести публикации.',
  },
  {
    icon: Layers,
    title: 'Абсолютный минимализм',
    text: 'Никакой баннерной рекламы и спама. Только чистый светлый дизайн с воздушной типографикой Inter и высокой скоростью работы.',
  },
];

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<'founder' | 'evaluator'>('founder');

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <nav className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo href="/" size="lg" />

          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <LandingMobileNav />

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline"
            >
              Войти
            </Link>
            <Link
              href="/register/founder"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </nav>

      <section
        id="hero"
        className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 md:pb-32 md:pt-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col justify-center text-center lg:col-span-5 lg:text-left">
              <span className="mb-6 inline-flex items-center gap-1.5 self-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary lg:self-start">
                <Sparkles className="h-3.5 w-3.5" />
                Закрытое сообщество экспертов и фаундеров
              </span>

              <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Откройте лучшие стартапы. <br />
                <span className="text-primary">Или покажите свой.</span>
              </h1>

              <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-8 lg:mx-0">
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-muted">Честные оценки</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">до 10 МБ</div>
                  <div className="text-xs text-muted">Файлы на карточку</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Live</div>
                  <div className="text-xs text-muted">Таблица рейтинга</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:col-span-1 lg:block" />

            <div className="relative lg:col-span-6">
              <div
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl"
                aria-hidden
              />

              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-gray-100">
                <div className="flex flex-col items-start justify-between gap-3 border-b border-border bg-background px-6 py-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      Демонстрационный каталог стартапов
                    </h3>
                    <p className="text-xs text-muted">
                      Пример распределения голосов в реальном времени
                    </p>
                  </div>
                  <div className="relative w-full opacity-60 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted" />
                    <input
                      type="text"
                      placeholder="Поиск..."
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-border bg-surface py-1.5 pl-8 pr-3 text-xs text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {LANDING_MOCK_STARTUPS.map((startup, idx) => (
                    <div
                      key={startup.id}
                      className="startup-card-fade-in flex select-none items-center justify-between gap-4 bg-surface p-4 sm:p-5"
                      style={{
                        animationDelay: `${idx * 100}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="w-4 text-center font-mono text-xs font-medium text-gray-400">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-foreground sm:text-base">
                            {startup.title}
                          </h4>
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {startup.shortDescription}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-400">
                            <span className="rounded bg-gray-100 px-1 font-medium uppercase tracking-wider text-gray-600">
                              {startup.creatorName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MessageSquare className="h-3 w-3" />{' '}
                              {startup.commentCount}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <FileText className="h-3 w-3" />{' '}
                              {startup.fileCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1">
                        <div className="rounded-md p-1 text-gray-300">
                          <ChevronUp className="h-4 w-4" />
                        </div>
                        <span
                          className={cn(
                            'min-w-[20px] px-1.5 text-center font-mono text-xs font-bold',
                            startup.score > 0 ? 'text-success' : 'text-primary',
                          )}
                        >
                          {startup.score}
                        </span>
                        <div className="rounded-md p-1 text-gray-300">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border bg-background px-5 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                    Проекты представлены в ознакомительных целях
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-border bg-surface px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Как это устроено?</h2>
            <p className="mt-3 text-muted">
              Два разных сценария — для фаундера стартапа и для эксперта-оценщика.
            </p>

            <div className="mt-6 inline-flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('founder')}
                className={cn(
                  'rounded-lg px-5 py-2 text-sm font-semibold transition-all',
                  activeTab === 'founder'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground',
                )}
              >
                Для основателей (Founders)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('evaluator')}
                className={cn(
                  'rounded-lg px-5 py-2 text-sm font-semibold transition-all',
                  activeTab === 'evaluator'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground',
                )}
              >
                Для оценщиков (Evaluators)
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {activeTab === 'founder' ? (
              <>
                <div className="rounded-2xl border border-gray-100 bg-background p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    1
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Создайте карточку</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Укажите название, детальное описание преимуществ и прикрепите
                    до 5 файлов (презентации, скриншоты или финансовую модель
                    размером до 10 МБ).
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-background p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    2
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Получайте отзывы</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Следите за ростом рейтинга в общей таблице лидеров. Получайте
                    комментарии профессиональных оценщиков и отвечайте на их
                    вопросы.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-gray-100 bg-background p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-500">
                    1
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Изучайте стартапы</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Пользуйтесь фильтрами сортировки по рейтингу и дате.
                    Скачивайте вложенные материалы проектов для глубокой
                    аналитики.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-background p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-500">
                    2
                  </div>
                  <h3 className="mb-3 text-xl font-bold">
                    Голосуйте и комментируйте
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Ставьте ▲ (апвоут) или ▼ (даунвоут), влияя на суммарный
                    рейтинг. Оставляйте честные экспертные рекомендации в
                    комментариях.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        id="audiences"
        className="bg-background px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Роли в сообществе</h2>
            <p className="mt-3 text-muted">
              Каждый решает свою практическую задачу в закрытой экосистеме
              платформы.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-8 shadow-sm">
              <div>
                <div className="mb-6 w-fit rounded-xl bg-red-50 p-3 text-primary">
                  <SquarePen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Основатели (Founders)</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted">
                  Для тех, кто хочет презентовать свою идею или работающий продукт
                  лояльной, но беспристрастной аудитории.
                </p>
                <ul className="space-y-3">
                  {[
                    'Публикация карточки с материалами',
                    'Загрузка файлов презентаций до 10 МБ',
                    'Обсуждение и ответы на вопросы',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register/founder"
                className="mt-8 block w-full rounded-lg border border-border bg-gray-50 py-3 text-center text-xs font-semibold text-foreground transition-colors hover:bg-gray-100"
              >
                Зарегистрироваться как фаундер
              </Link>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-sm">
              <div className="absolute right-4 top-4 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                Важная роль
              </div>
              <div>
                <div className="mb-6 w-fit rounded-xl bg-orange-50 p-3 text-orange-500">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Оценщики (Evaluators)</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted">
                  Опытные инвесторы, продуктовые менеджеры и аналитики. Оценивают
                  состоятельность бизнес-модели и качество реализации продукта.
                </p>
                <ul className="space-y-3">
                  {[
                    'Голосование ▲/▼ (по одному на стартап)',
                    'Написание развернутых комментариев',
                    'Скачивание вложений в один клик',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register/founder"
                className="mt-8 block w-full rounded-lg border border-border bg-gray-50 py-3 text-center text-xs font-semibold text-foreground transition-colors hover:bg-gray-100"
              >
                Подать заявку на оценщика
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-border bg-surface px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Почему выбирают нас
              </span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                Ключевые преимущества Startup Hunt
              </h2>
            </div>
            <p className="max-w-md text-muted lg:text-right">
              Мы убрали всё лишнее, что отвлекает на стандартных площадках,
              оставив кристально сфокусированный интерфейс для объективной
              оценки.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-xl border border-gray-100 bg-background p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-bold text-foreground">
                  {feat.title}
                </h4>
                <p className="text-xs leading-relaxed text-muted">{feat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="final-cta"
        className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Готовы заявить о своем продукте?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
            Зарегистрируйте личный кабинет, и администратор оперативно откроет
            доступ к вашей роли — основателя, эксперта-оценщика или наблюдателя.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register/founder"
              className="w-full rounded-xl bg-primary px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/30 sm:w-auto"
            >
              Создать аккаунт бесплатно
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl border border-border bg-surface px-8 py-4 text-center text-base font-medium text-foreground transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              Войти в сообщество
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-[#1A1A1A] px-4 py-12 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
              ▲
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Startup<span className="text-primary">Hunt</span>
            </span>
          </Link>

          <p className="text-center text-xs text-gray-500">
            © 2026 Startup Hunt. Все права защищены. Разработано для оценки
            закрытых ИТ-стартапов.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-gray-400">
            <Link href="/login" className="transition-colors hover:text-primary">
              Войти
            </Link>
            <Link
              href="/register/founder"
              className="transition-colors hover:text-primary"
            >
              Создать аккаунт
            </Link>
            <Link href="/login" className="transition-colors hover:text-primary">
              Витрина стартапов
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
