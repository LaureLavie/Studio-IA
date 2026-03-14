import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Éther — Studio Multimédia IA',
  description: 'Génère des images, de la musique, transcris et synthétise de la voix. Un studio créatif tout-en-un propulsé par l\'IA.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
