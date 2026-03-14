'use client';
import { useState } from 'react';
import { genererTexte } from '@/lib/api';
import { useStudio } from '@/lib/studioContext';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

const PERSONNALITES = [
  { id: 'creatif', label: 'Créatif', systeme: 'Tu es un assistant créatif passionné. Tu aides à écrire des scénarios, des descriptions visuelles, des synopsis et des textes narratifs riches et évocateurs.' },
  { id: 'copywriter', label: 'Copywriter', systeme: 'Tu es un expert en copywriting. Tu rédiges des accroches percutantes, des descriptions de produits captivantes et des textes marketing efficaces.' },
  { id: 'poete', label: 'Poète', systeme: 'Tu es un poète contemporain. Tu joues avec les mots, les images et les rythmes pour créer des textes lyriques et évocateurs.' },
  { id: 'technique', label: 'Technique', systeme: 'Tu es un assistant technique précis. Tu expliques clairement, structures les informations et réponds de manière factuelle et documentée.' },
  { id: 'custom', label: 'Personnalisé', systeme: '' },
];

export default function TextePage() {
  const { setDernierTexte } = useStudio();
  const [prompt, setPrompt] = useState('');
  const [persoId, setPersoId] = useState('creatif');
  const [systemeCustom, setSystemeCustom] = useState('');
  const [resultat, setResultat] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const [copied, setCopied] = useState(false);

  const perso = PERSONNALITES.find(p => p.id === persoId)!;
  const systeme = persoId === 'custom' ? systemeCustom : perso.systeme;

  async function handleGenerer() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResultat('');
    try {
      const data = await genererTexte(prompt, systeme);
      setResultat(data.texte);
      setDernierTexte(data.texte);
    } catch (e: unknown) {
      setToast({ msg: e instanceof Error ? e.message : 'Erreur inconnue', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleCopier() {
    navigator.clipboard.writeText(resultat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="ether-animate-fade-in">
      <div className="ether-flex-between ether-mb-lg">
        <div>
          <h1 className="ether-h1">Texte & Assistant</h1>
          <p className="ether-body-sm ether-mt-sm">
            Génère des textes créatifs avec Llama 3 via Groq
          </p>
        </div>
        <span className="ether-tag ether-tag-violet">Gratuit · 14 400 req/jour</span>
      </div>

      <div className="ether-grid-2" style={{ gap: '24px', alignItems: 'start' }}>
        {/* Colonne gauche — paramètres */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Personnalité */}
          <div className="ether-card-elevated">
            <label className="ether-field-label">Personnalité de l&apos;assistant</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {PERSONNALITES.map(p => (
                <button
                  key={p.id}
                  className={`ether-btn ether-btn-sm ${persoId === p.id ? 'ether-btn-primary' : 'ether-btn-surface'}`}
                  onClick={() => setPersoId(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {persoId === 'custom' && (
              <textarea
                className="ether-textarea"
                rows={3}
                placeholder="Décris la personnalité et le rôle de l'assistant..."
                value={systemeCustom}
                onChange={e => setSystemeCustom(e.target.value)}
              />
            )}

            {persoId !== 'custom' && (
              <p className="ether-body-sm" style={{
                background: 'var(--ether-bg-elevated)',
                borderRadius: 'var(--ether-radius-md)',
                padding: '10px 14px',
                borderLeft: '3px solid var(--ether-violet-border)',
              }}>
                {perso.systeme}
              </p>
            )}
          </div>

          {/* Prompt */}
          <div className="ether-card-elevated">
            <label className="ether-field-label">Ton message</label>
            <textarea
              className="ether-prompt-area"
              rows={6}
              placeholder="Décris ce que tu veux créer... Ex: Écris un synopsis de 3 paragraphes pour un court-métrage de science-fiction atmosphérique..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerer();
              }}
            />
            <div className="ether-flex-between" style={{ marginTop: '12px' }}>
              <span className="ether-body-sm">Ctrl+Enter pour générer</span>
              <button
                className="ether-btn ether-btn-primary"
                onClick={handleGenerer}
                disabled={loading || !prompt.trim()}
              >
                {loading ? 'Génération...' : '✦ Générer'}
              </button>
            </div>
          </div>
        </div>

        {/* Colonne droite — résultat */}
        <div className="ether-card-elevated" style={{ minHeight: '400px' }}>
          <div className="ether-flex-between ether-mb-md">
            <label className="ether-field-label">Résultat</label>
            {resultat && (
              <button
                className="ether-btn ether-btn-sm ether-btn-ghost"
                onClick={handleCopier}
              >
                {copied ? '✓ Copié' : '⎘ Copier'}
              </button>
            )}
          </div>

          {loading && <Spinner label="Génération en cours..." />}

          {!loading && !resultat && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '300px', gap: '12px',
            }}>
              <span style={{ fontSize: '40px', opacity: 0.2 }}>✦</span>
              <p className="ether-body-sm">Le texte généré apparaîtra ici</p>
            </div>
          )}

          {resultat && (
            <div
              className="ether-animate-fade-in"
              style={{
                whiteSpace: 'pre-wrap', lineHeight: 1.8,
                color: 'var(--ether-text-secondary)',
                fontSize: '14px', fontFamily: 'var(--ether-font-body)',
              }}
            >
              {resultat}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
