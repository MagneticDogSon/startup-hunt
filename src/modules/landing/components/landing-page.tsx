'use client';

import { useEffect, useState } from 'react';
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
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 },
    );

    ['hero', ...navLinks.map((link) => link.href.slice(1))].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased bg-dot-pattern">
      <nav className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo href="/" size="lg" />

          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                className={cn(
                  'relative transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all hover:text-foreground hover:after:w-full',
                  activeSection === link.href.slice(1)
                    ? 'text-primary after:w-full'
                    : 'after:w-0',
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <LandingMobileNav />

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline hover:scale-105 active:scale-95 duration-150"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="rounded-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-on-primary shadow-md shadow-blue-500/10 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200"
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
        {/* Мягкие свечения на фоне */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl opacity-25 pointer-events-none" />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col justify-center text-center lg:col-span-5 lg:text-left">
              <span 
                className="mb-6 inline-flex items-center gap-1.5 self-center rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-medium text-primary lg:self-start animate-fade-in-up"
                style={{ animationDelay: '0ms' }}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                Закрытое сообщество экспертов и фаундеров
              </span>

              <h1 
                className="mb-6 text-4xl font-semibold leading-[1.1] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[60px] lg:tracking-[-0.03em] animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
              >
                Откройте лучшие стартапы. <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Или покажите свой.</span>
              </h1>

              <p 
                className="mb-8 text-base text-muted sm:text-lg leading-relaxed animate-fade-in-up max-w-lg mx-auto lg:mx-0"
                style={{ animationDelay: '200ms' }}
              >
                Startup Hunt — закрытая платформа, где фаундеры публикуют свои идеи, а эксперты честно голосуют и оставляют обратную связь.
              </p>

              <div 
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                <Link
                  href="/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-medium text-on-primary shadow-md shadow-blue-500/15 transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200"
                >
                  Создать аккаунт бесплатно
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-border-strong bg-surface px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-background-soft hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200"
                >
                  Войти в сообщество
                </Link>
              </div>

              <div 
                className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border-cool pt-8 lg:mx-0 animate-fade-in-up"
                style={{ animationDelay: '400ms' }}
              >
                <div className="transition-all hover:scale-105 duration-200">
                  <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-xs text-muted">Честные оценки</div>
                </div>
                <div className="transition-all hover:scale-105 duration-200">
                  <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">до 10 МБ</div>
                  <div className="text-xs text-muted">Файлы на карточку</div>
                </div>
                <div className="transition-all hover:scale-105 duration-200">
                  <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Live</div>
                  <div className="text-xs text-muted">Таблица рейтинга</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:col-span-1 lg:block" />

            <div 
              className="relative lg:col-span-6 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_16px_48px_rgba(37,99,235,0.1)] duration-300">
                <div className="flex flex-col items-start justify-between gap-3 border-b border-border bg-background-soft px-6 py-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
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
                      className="w-full cursor-not-allowed rounded-sm border border-border bg-surface py-1.5 pl-8 pr-3 text-xs text-faint focus:outline-none"
                    />
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {LANDING_MOCK_STARTUPS.map((startup, idx) => (
                    <div
                      key={startup.id}
                      className="flex select-none items-center justify-between gap-4 bg-surface p-4 sm:p-5 transition-all hover:bg-background-soft/50 hover:translate-x-1 duration-200 cursor-pointer"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="w-4 text-center font-mono text-xs font-semibold text-muted-2">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-medium text-foreground sm:text-base transition-colors hover:text-primary">
                            {startup.title}
                          </h4>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {startup.shortDescription}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-2">
                            <span className="rounded-xs bg-background-soft px-1 font-medium uppercase tracking-wider text-muted">
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

                      <div className="flex items-center gap-1 rounded-sm border border-border-cool bg-background-soft p-1">
                        <div className="rounded-xs p-1 text-faint transition-all hover:scale-120 hover:text-upvote hover:shadow-[0_0_8px_color-mix(in_srgb,var(--upvote)_45%,transparent)] duration-150">
                          <ChevronUp className="h-4 w-4" />
                        </div>
                        <span
                          className={cn(
                            'min-w-[20px] px-1.5 text-center font-mono text-xs font-semibold',
                            startup.score > 0 ? 'text-upvote' : startup.score < 0 ? 'text-downvote' : 'text-muted',
                          )}
                        >
                          {startup.score}
                        </span>
                        <div className="rounded-xs p-1 text-faint transition-all hover:scale-120 hover:text-downvote hover:shadow-[0_0_8px_color-mix(in_srgb,var(--downvote)_45%,transparent)] duration-150">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border bg-background-soft px-5 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-2">
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
        className="border-y border-border bg-background-soft/60 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Как это устроено?</h2>
            <p className="mt-3 text-muted">
              Два разных сценария — для фаундера стартапа и для эксперта-оценщика.
            </p>

            <div
              role="tablist"
              aria-label="Сценарий использования"
              className="mt-6 inline-flex rounded-md border border-border bg-background-soft p-1 shadow-sm"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'founder'}
                aria-controls="founder-panel"
                onClick={() => setActiveTab('founder')}
                className={cn(
                  'rounded-sm px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                  activeTab === 'founder'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground',
                )}
              >
                Для основателей (Founders)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'evaluator'}
                aria-controls="evaluator-panel"
                onClick={() => setActiveTab('evaluator')}
                className={cn(
                  'rounded-sm px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                  activeTab === 'evaluator'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground',
                )}
              >
                Для оценщиков (Evaluators)
              </button>
            </div>
          </div>

          <div
            id={activeTab === 'founder' ? 'founder-panel' : 'evaluator-panel'}
            role="tabpanel"
            className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"
          >
            {activeTab === 'founder' ? (
              <>
                <div className="rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background-soft text-lg font-semibold text-primary">
                    1
                  </div>
                  <h3 className="mb-3 text-xl font-medium">Создайте карточку</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Укажите название, детальное описание преимуществ и прикрепите
                    до 5 файлов (презентации, скриншоты или финансовую модель
                    размером до 10 МБ).
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background-soft text-lg font-semibold text-primary">
                    2
                  </div>
                  <h3 className="mb-3 text-xl font-medium">Получайте отзывы</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Следите за ростом рейтинга в общей таблице лидеров. Получайте
                    комментарии профессиональных оценщиков и отвечайте на их
                    вопросы.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background-soft text-lg font-semibold text-primary">
                    1
                  </div>
                  <h3 className="mb-3 text-xl font-medium">Изучайте стартапы</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Пользуйтесь фильтрами сортировки по рейтингу и дате.
                    Скачивайте вложенные материалы проектов для глубокой
                    аналитики.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background-soft text-lg font-semibold text-primary">
                    2
                  </div>
                  <h3 className="mb-3 text-xl font-medium">
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
        className="bg-background/80 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Роли в сообществе</h2>
            <p className="mt-3 text-muted">
              Каждый решает свою практическую задачу в закрытой экосистеме
              платформы.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div>
                <div className="mb-6 w-fit rounded-md border border-border bg-background-soft p-3 text-primary">
                  <SquarePen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Основатели (Founders)</h3>
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
                href="/register"
                className="mt-8 block w-full rounded-sm border border-border-strong py-3 text-center text-xs font-medium text-foreground transition-all hover:bg-background-soft hover:border-primary/40 hover:scale-[1.02] active:scale-98 duration-200"
              >
                Зарегистрироваться как фаундер
              </Link>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-canvas-night p-8 text-on-dark shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-on-primary">
                Важная роль
              </div>
              <div>
                <div className="mb-6 w-fit rounded-md border border-white/10 bg-canvas-night-soft p-3 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Оценщики (Evaluators)</h3>
                <p className="mb-6 text-sm leading-relaxed text-white/70">
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
                      className="flex items-start gap-2 text-xs text-on-dark"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 block w-full rounded-sm border border-white/20 bg-canvas-night-soft py-3 text-center text-xs font-medium text-on-dark transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-98 duration-200"
              >
                Подать заявку на оценщика
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-border bg-background-soft/60 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Почему выбирают нас
              </span>
              <h2 className="mt-2 text-3xl font-semibold text-foreground tracking-tight">
                Ключевые преимущества Startup Hunt
              </h2>
            </div>
            <p className="max-w-md text-muted lg:text-right text-sm sm:text-base">
              Мы убрали всё лишнее, что отвлекает на стандартных площадках,
              оставив кристально сфокусированный интерфейс для объективной
              оценки.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-lg border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background-soft text-primary">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-foreground">
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
        className="bg-background/80 backdrop-blur-sm px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Готовы заявить о своем продукте?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg text-muted">
            Зарегистрируйте личный кабинет, и администратор оперативно откроет
            доступ к вашей роли — основателя, эксперта-оценщика или наблюдателя.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-center text-base font-medium text-on-primary shadow-md shadow-blue-500/15 transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200"
            >
              Создать аккаунт бесплатно
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-border-strong bg-surface px-8 py-4 text-center text-base font-medium text-foreground transition-all hover:bg-background-soft hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200"
            >
              Войти в сообщество
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-6 py-16 text-muted sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <BrandLogo href="/" size="sm" />

          <p className="text-center text-xs text-muted">
            © 2026 Startup Hunt. Все права защищены. Разработано для оценки
            закрытых ИТ-стартапов.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-muted">
            <Link href="/login" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
              Войти
            </Link>
            <Link
              href="/register"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Создать аккаунт
            </Link>
            <Link href="/startups" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
              Витрина стартапов
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
