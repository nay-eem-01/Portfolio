import type { Metadata } from 'next';
import { Familjen_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Familjen_Grotesk({ subsets: ['latin'], weight: ['500', '600'], variable: '--ff-familjen', display: 'swap' });
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--ff-plex', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--ff-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: 'Md. Nayeem Ahmed, Java backend developer',
  description: 'Java backend developer at Dhrubok Infotech, Dhaka. Spring Boot, WebFlux, PostgreSQL, Neo4j, Kafka. Four products built end to end.',
  metadataBase: new URL('https://nayeem-ahmed-portfolio.netlify.app'),
  openGraph: { title: 'Md. Nayeem Ahmed, Java backend developer', images: ['/images/nayeem.jpg'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* Reveals only hide content once script runs; without it the page shows everything. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
