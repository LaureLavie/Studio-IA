'use client';
import Link from 'next/link';

const modules = [
  {
    href: '/texte',
    icon: '✦',
    titre: 'Texte & Assistant',
    desc: 'Génère des textes créatifs, scénarios, descriptions et dialogues avec un assistant IA personnalisé.',
    tag: 'Groq · Llama 3',
    accent: 'violet',
  },
  {
    href: '/image',
    icon: '◈',
    titre: "Génération d'images",
    desc: 'Transforme tes descriptions en visuels cinématiques, illustrations et concepts artistiques.',
    tag: 'Pollinations.ai',
    accent: 'violet',
  },
  {
    href: '/audio',
    icon: '◎',
    titre: 'Audio & Voix',
    desc: "Transcris, synthétise des voix et compose des musiques d'ambiance pour tes projets.",
    tag: 'Whisper · Edge-TTS · MusicGen',
    accent: 'cyan',
  },
  {
    href: '/studio',
    icon: '⬡',
    titre: "Studio d'assemblage",
    desc: "Fusionne tes créations — image, son, texte — en projets cohérents et exportables.",
    tag: 'Espace de travail',
    accent: 'cyan',
  },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(138,43,226,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="ether-animate-fade-in">
          <h1 className="ether-display-gradient" style={{ marginBottom: '16px' }}>
            Éther
          </h1>
          <p className="ether-label" style={{ marginBottom: '24px', letterSpacing: '0.3em' }}>
            Studio de Création Multimédia IA
          </p>
          <p className="ether-body" style={{ maxWidth: '480px', marginBottom: '40px' }}>
            Un espace fluide pour générer des images, de la musique, transcrire ta voix
            et assembler tes projets créatifs avec l&apos;IA gratuite.
          </p>
          <Link href="/texte" className="ether-btn ether-btn-primary ether-btn-lg">
            Commencer à créer
          </Link>
        </div>
      </section>

      {/* Modules */}
      <section className="ether-container" style={{ paddingBottom: '80px' }}>
        <div className="ether-grid-2" style={{ gap: '16px' }}>
          {modules.map((m, i) => (
            <Link
              key={m.href}
              href={m.href}
              style={{ textDecoration: 'none' }}
              className={`ether-animate-fade-in ether-delay-${i + 1}`}
            >
              <div
                className={`ether-card module-card module-card--${m.accent} ether-delay-${i + 1}`}
                style={{ cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{m.icon}</div>
                <h2 className="ether-h3" style={{ marginBottom: '8px' }}>{m.titre}</h2>
                <p className="ether-body-sm" style={{ marginBottom: '16px', lineHeight: 1.7 }}>{m.desc}</p>
                <span
                  className={m.accent === 'cyan' ? 'ether-tag ether-tag-cyan' : 'ether-tag ether-tag-violet'}
                  style={{ fontSize: '10px' }}
                >
                  {m.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .module-card {
          transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
        }
        .module-card--violet:hover {
          border-color: var(--ether-violet-border) !important;
          transform: translateY(-3px);
          box-shadow: var(--ether-shadow-violet);
        }
        .module-card--cyan:hover {
          border-color: var(--ether-cyan-border) !important;
          transform: translateY(-3px);
          box-shadow: var(--ether-shadow-cyan);
        }
      `}</style>
    </main>
  );
}