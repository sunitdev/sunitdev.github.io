import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { ShortcutsOverlay } from '@/components/shortcuts-overlay';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jb-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description:
    'Senior Software Engineer at Reddit. 8+ years across Reddit, Workday, and Amazon — ML-powered content platforms, cloud-agnostic observability, distributed systems.',
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: 'website',
    url: site.url,
    title: `${site.name} — ${site.title}`,
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image', title: `${site.name} — ${site.title}` },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1115' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jbMono.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-elev focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
          >
            Skip to content
          </a>
          {children}
          <ShortcutsOverlay />
        </Providers>
      </body>
    </html>
  );
}
