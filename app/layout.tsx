import type { Metadata, Viewport } from 'next';
import { Hepta_Slab, Rethink_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const slab = Hepta_Slab({ subsets: ['latin'], weight: ['500', '600'], variable: '--ff-slab', display: 'swap' });
const sans = Rethink_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--ff-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--ff-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://nayeem-ahmed-portfolio.netlify.app'),
  title: { default: 'Md. Nayeem Ahmed, backend engineer', template: '%s, Md. Nayeem Ahmed' },
  description: 'Java and Spring Boot backend engineer in Dhaka. Case studies on checkout races, RAG with citations, courier ledgers and session security.',
  openGraph: { title: 'Md. Nayeem Ahmed, backend engineer', images: ['/images/nayeem.jpg'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e100f' },
  ],
};

// Runs before paint: the saved theme, else the system one. Also marks that script runs, for reveals.
const boot = `(()=>{var r=document.documentElement;r.classList.add('js');var t;try{t=localStorage.getItem('theme')}catch(e){}r.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${slab.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
