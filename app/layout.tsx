import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luan & Sarah — Um novo capítulo',
  description: 'Uma experiência criada para celebrar um novo capítulo na história de Luan e Sarah.',
  openGraph: {
    title: 'Luan & Sarah — Um novo capítulo',
    description: 'Uma história de amor está prestes a ganhar um novo capítulo.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Luan & Sarah — Um novo capítulo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luan & Sarah — Um novo capítulo',
    description: 'Uma história de amor está prestes a ganhar um novo capítulo.',
    images: ['/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
