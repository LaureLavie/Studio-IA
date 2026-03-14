'use client';
import { useStudio } from '@/lib/studioContext';
import Link from 'next/link';

interface SlotProps {
  titre: string;
  icon: string;
  href: string;
  accent: 'violet' | 'cyan';
  children: React.ReactNode;
}

function Slot({ titre, icon, href, accent, children }: SlotProps) {
  const borderColor = accent === 'cyan' ? 'var(--ether-cyan-border)' : 'var(--ether-violet-border)';
  const tagClass = accent === 'cyan' ? 'ether-tag ether-tag-cyan' : 'ether-tag ether-tag-violet';

  return (
    <div className="ether-card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="ether-flex-between">
        <div className="ether-flex-center ether-gap-sm">
          <span style={{ fontSize: '18px' }}>{icon}</span>
          <h2 className="ether-h3">{titre}</h2>
        </div>
        <Link href={href} className={tagClass} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          + Créer
        </Link>
      </div>
      <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '16px' }}>
        {children}
      </div>
    </div>
  );
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '32px 16px',
      border: '1px dashed var(--ether-border-visible)',
      borderRadius: 'var(--ether-radius-lg)',
      opacity: 0.5,
    }}>
      <p className="ether-body-sm">{label}</p>
    </div>
  );
}

export default function StudioPage() {
  const {
    derniereImage, dernierTexte,
    derniereMusique, derniereVoix,
  } = useStudio();

  const hasContent = derniereImage || dernierTexte || derniereMusique || derniereVoix;

  return (
    <div className="ether-animate-fade-in">
      <div className="ether-flex-between ether-mb-lg">
        <div>
          <h1 className="ether-h1">Studio d&apos;assemblage</h1>
          <p className="ether-body-sm ether-mt-sm">
            Retrouve ici tous tes éléments générés pour les combiner en projet
          </p>
        </div>
        {hasContent && (
          <span className="ether-badge ether-badge-live">Session active</span>
        )}
      </div>

      {/* Message si aucune création */}
      {!hasContent && (
        <div className="ether-card ether-animate-fade-in" style={{
          textAlign: 'center', padding: '60px 24px',
          background: 'var(--ether-glass-bg)',
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.3 }}>⬡</span>
          <h2 className="ether-h2" style={{ marginBottom: '12px', opacity: 0.6 }}>
            Ton studio est vide
          </h2>
          <p className="ether-body" style={{ marginBottom: '28px', maxWidth: '420px', margin: '0 auto 28px' }}>
            Génère du texte, des images ou de l&apos;audio dans les autres onglets.
            Tout apparaîtra ici automatiquement pour être assemblé.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/texte" className="ether-btn ether-btn-ghost">✦ Texte</Link>
            <Link href="/image" className="ether-btn ether-btn-ghost">◈ Image</Link>
            <Link href="/audio" className="ether-btn ether-btn-cyan">◎ Audio</Link>
          </div>
        </div>
      )}

      {/* Grille des slots */}
      {hasContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Ligne 1 — Image + Texte */}
          <div className="ether-grid-2" style={{ gap: '20px', alignItems: 'start' }}>

            <Slot titre="Dernière image" icon="◈" href="/image" accent="violet">
              {derniereImage
                ? (
                  <div className="ether-result-frame ether-animate-scale-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={derniereImage}
                      alt="Dernière image générée"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <div className="ether-result-overlay">
                      <a
                        href={derniereImage}
                        download={`ether-image-${Date.now()}.png`}
                        target="_blank"
                        className="ether-btn ether-btn-sm ether-btn-cyan"
                      >
                        ↓ Sauvegarder
                      </a>
                    </div>
                  </div>
                )
                : <EmptySlot label="Génère une image pour qu'elle apparaisse ici" />
              }
            </Slot>

            <Slot titre="Dernier texte" icon="✦" href="/texte" accent="violet">
              {dernierTexte
                ? (
                  <div className="ether-animate-fade-in">
                    <div style={{
                      maxHeight: '240px', overflowY: 'auto',
                      whiteSpace: 'pre-wrap', lineHeight: 1.8,
                      color: 'var(--ether-text-secondary)', fontSize: '13px',
                      padding: '4px',
                    }}>
                      {dernierTexte}
                    </div>
                    <button
                      className="ether-btn ether-btn-sm ether-btn-ghost"
                      style={{ marginTop: '12px' }}
                      onClick={() => navigator.clipboard.writeText(dernierTexte)}
                    >
                      ⎘ Copier le texte
                    </button>
                  </div>
                )
                : <EmptySlot label="Génère du texte pour qu'il apparaisse ici" />
              }
            </Slot>
          </div>

          {/* Ligne 2 — Voix + Musique */}
          <div className="ether-grid-2" style={{ gap: '20px', alignItems: 'start' }}>

            <Slot titre="Synthèse vocale" icon="◎" href="/audio" accent="cyan">
              {derniereVoix
                ? (
                  <div className="ether-audio-player ether-animate-fade-in">
                    <audio controls src={derniereVoix} style={{ width: '100%' }} />
                  </div>
                )
                : <EmptySlot label="Synthétise une voix pour qu'elle apparaisse ici" />
              }
            </Slot>

            <Slot titre="Musique générée" icon="♪" href="/audio" accent="cyan">
              {derniereMusique
                ? (
                  <div className="ether-audio-player ether-animate-fade-in">
                    <audio controls src={derniereMusique} style={{ width: '100%' }} />
                  </div>
                )
                : <EmptySlot label="Compose une musique pour qu'elle apparaisse ici" />
              }
            </Slot>
          </div>

          {/* Barre d'export */}
          <div className="ether-card" style={{
            borderColor: 'var(--ether-violet-border)',
            background: 'var(--ether-violet-faint)',
          }}>
            <div className="ether-flex-between">
              <div>
                <p className="ether-h3" style={{ marginBottom: '4px' }}>Exporter le projet</p>
                <p className="ether-body-sm">
                  Télécharge chaque élément séparément depuis les slots ci-dessus.
                  Le fusionnage vidéo (image + audio) sera disponible dans une prochaine version.
                </p>
              </div>
              <span className="ether-tag ether-tag-violet" style={{ flexShrink: 0 }}>
                Bientôt
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
