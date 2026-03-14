'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/texte',  label: 'Texte',  icon: '✦' },
  { href: '/image',  label: 'Image',  icon: '◈' },
  { href: '/audio',  label: 'Audio',  icon: '◎' },
  { href: '/studio', label: 'Studio', icon: '⬡' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="ether-nav">
      <Link href="/" className="ether-nav-logo">Éther</Link>

      <div className="ether-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="ether-tab"
            data-active={pathname.startsWith(tab.href) ? 'true' : undefined}
          >
            <span style={{ fontSize: '14px', opacity: 0.8 }}>{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </div>

      <div style={{ width: '80px' }} /> {/* équilibre visuel */}
    </nav>
  );
}
