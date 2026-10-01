import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { ShortcutsOverlay } from '@/components/shortcuts-overlay';
import { site } from '@/lib/site';
import './globals.css';

const displayFont = localFont({
  src: '../assets/fonts/instrument-serif.woff2',
  variable: '--font-display',
  weight: '400',
  display: 'swap',
});
const readingFont = localFont({
  src: '../assets/fonts/source-serif-4.woff2',
  variable: '--font-reading',
  weight: '200 900',
  display: 'swap',
});
const codeFont = localFont({
  src: '../assets/fonts/ibm-plex-mono.woff2',
  variable: '--font-code',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description:
    'A personal journal about learning, following curiosity, and exploring ideas through notes and hands-on experiments.',
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
    { media: '(prefers-color-scheme: light)', color: '#f4f1e8' },
    { media: '(prefers-color-scheme: dark)', color: '#191a18' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${readingFont.variable} ${codeFont.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main"
            className="focus:bg-bg-elev sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
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
