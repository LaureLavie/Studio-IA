'use client';
import { useState } from 'react';
import Image from 'next/image';
import { genererImage } from '@/lib/api';
import { useStudio } from '@/lib/studioContext';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

const FORMATS = [
  { label: 'Carré 1:1',    largeur: 1024, hauteur: 1024 },
  { label: 'Portrait 2:3', largeur: 768,  hauteur: 1152 },
  { label: 'Paysage 3:2',  largeur: 1152, hauteur: 768  },
  { label: 'Cinéma 16:9',  largeur: 1280, hauteur: 720  },
];

const STYLES_SUGGES = [
  'cinématique, lumière volumétrique',
  'illustration vectorielle minimaliste',
  'photographie analogique grain 35mm',
  'concept art sci-fi atmosphérique',
  'aquarelle douce tons pastels',
  'rendu 3D hyperréaliste',
];

export default function ImagePage() {
  const { setDerniereImage } = useStudio();

  const [prompt, setPrompt]       = useState('');
  const [formatIdx, setFormatIdx] = useState(0);
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  const format = FORMATS[formatIdx];

  async function handleGenerer() {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);
    try {
      const data = await genererImage(prompt, format.largeur, format.hauteur);
      setImageUrl(data.url);
      setDerniereImage(data.url);
    } catch (e: unknown) {
      setToast({ msg: e instanceof Error ? e.message : 'Erreur inconnue', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(s: string) {
    setPrompt(prev => prev ? `${prev}, ${s}` : s);
  }

  function handleTelecharger() {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `ether-${Date.now()}.png`;
    a.target = '_blank';
    a.click();
  }

  return (
    <div className="ether-animate-fade-in">
      <div className="ether-flex-between ether-mb-lg">
        <div>
          <h1 className="ether-h1">Génération d&apos;images</h1>
          <p className="ether-body-sm ether-mt-sm">Transforme tes descriptions en visuels via Pollinations.ai</p>
        </div>
        <span className="ether-tag ether-tag-cyan">Gratuit · Illimité</span>
      </div>

      <div className="ether-grid-2" style={{ gap: '24px', alignItems: 'start' }}>

        {/* ── Colonne gauche — paramètres ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Format */}
          <div className="ether-card-elevated">
            <label className="ether-field-label">Format de sortie</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {FORMATS.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setFormatIdx(i)}
                  className={`ether-btn ether-btn-sm ${formatIdx === i ? 'ether-btn-primary' : 'ether-btn-surface'}`}
                  style={{ justifyContent: 'flex-start', gap: '8px' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: `${Math.round(14 * f.largeur / 1024)}px`,
                    height: `${Math.round(14 * f.hauteur / 1024)}px`,
                    border: '1.5px solid currentColor',
                    borderRadius: '2px',
                    flexShrink: 0,
                  }} />
                  {f.label}
                </button>
              ))}
            </div>
            <p className="ether-body-sm" style={{ marginTop: '10px' }}>
              {format.largeur} × {format.hauteur} px
            </p>
          </div>

          {/* Prompt */}
          <div className="ether-card-elevated">
            <label className="ether-field-label">Description de l&apos;image</label>
            <textarea
              className="ether-prompt-area"
              rows={5}
              placeholder="Ex: Une forêt de cristaux violets sous une lune bleue, lumière atmosphérique, style cinématique..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerer(); }}
            />

            {/* Suggestions de style */}
            <div style={{ marginTop: '12px' }}>
              <p className="ether-label" style={{ marginBottom: '8px' }}>Ajouter un style</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {STYLES_SUGGES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="ether-tag ether-tag-surface"
                    style={{ cursor: 'pointer', border: 'none', transition: 'all 150ms ease' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ether-violet-border)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="ether-flex-between" style={{ marginTop: '16px' }}>
              <button className="ether-btn ether-btn-sm ether-btn-ghost" onClick={() => setPrompt('')}>
                Effacer
              </button>
              <button
                className="ether-btn ether-btn-primary"
                onClick={handleGenerer}
                disabled={loading || !prompt.trim()}
              >
                {loading ? 'Génération...' : '◈ Générer'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Colonne droite — résultat ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ether-card-elevated" style={{
            minHeight: '400px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {loading && (
              <>
                <div className="ether-skeleton" style={{ width: '100%', aspectRatio: `${format.largeur}/${format.hauteur}`, marginBottom: '16px' }} />
                <Spinner label="Génération de l'image..." />
              </>
            )}

            {!loading && !imageUrl && (
              <div style={{ textAlign: 'center', opacity: 0.4 }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>◈</span>
                <p className="ether-body-sm">L&apos;image générée apparaîtra ici</p>
              </div>
            )}

            {imageUrl && !loading && (
              <div className="ether-result-frame ether-animate-scale-in" style={{ width: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={prompt}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--ether-radius-xl)' }}
                />
                <div className="ether-result-overlay">
                  <button className="ether-btn ether-btn-sm ether-btn-cyan" onClick={handleTelecharger}>
                    ↓ Télécharger
                  </button>
                  <button className="ether-btn ether-btn-sm ether-btn-ghost" onClick={handleGenerer}>
                    ↺ Regénérer
                  </button>
                </div>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="ether-card ether-animate-fade-in">
              <p className="ether-label ether-mb-sm">Prompt utilisé</p>
              <p className="ether-body-sm" style={{ fontStyle: 'italic' }}>{prompt}</p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
