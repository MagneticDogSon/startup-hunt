import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Startup Hunt — платформа оценки стартапов',
  description:
    'Startup Hunt — платформа, где основатели публикуют идеи, а эксперты честно голосуют. Прозрачный рейтинг, файлы и обратная связь в одном месте.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
