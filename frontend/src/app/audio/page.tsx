'use client';
import { useState, useRef, useEffect } from 'react';
import { transcrireAudio, synthetiserVoix, genererMusique, getVoix, type VoixItem } from '@/lib/api';
import { useStudio } from '@/lib/studioContext';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

type SousOnglet = 'stt' | 'tts' | 'musique';

// ── Waveform décoratif ────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="ether-waveform" style={{ justifyContent: 'center' }}>
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className={`ether-waveform-bar${active ? ' active' : ''}`}
          style={{ height: `${20 + Math.sin(i * 0.8) * 12}px` }}
        />
      ))}
    </div>
  );
}

// ── Composant lecteur audio ───────────────────────────────────
function AudioPlayer({ blob, filename }: { blob: Blob; filename: string }) {
  const url = URL.createObjectURL(blob);
  return (
    <div className="ether-audio-player ether-animate-fade-in">
      <div className="ether-flex-between ether-mb-sm">
        <span className="ether-label">{filename}</span>
        <a
          href={url}
          download={filename}
          className="ether-btn ether-btn-sm ether-btn-cyan"
        >
          ↓ Télécharger
        </a>
      </div>
      <audio controls src={url} style={{ width: '100%', marginTop: '8px' }} />
    </div>
  );
}

export default function AudioPage() {
  const { setDerniereVoix, setDerniereMusique } = useStudio();
  const [sousOnglet, setSousOnglet] = useState<SousOnglet>('stt');
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  // ── STT state ─────────────────────────────────────────────
  const [fichierAudio, setFichierAudio] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [loadingStt, setLoadingStt] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── TTS state ─────────────────────────────────────────────
  const [texteTts, setTexteTts] = useState('');
  const [voixId, setVoixId] = useState('fr-FR-DeniseNeural');
  const [voixDispo, setVoixDispo] = useState<VoixItem[]>([]);
  const [audioVoix, setAudioVoix] = useState<Blob | null>(null);
  const [loadingTts, setLoadingTts] = useState(false);

  // ── Musique state ─────────────────────────────────────────
  const [promptMusique, setPromptMusique] = useState('');
  const [duree, setDuree] = useState(10);
  const [audioMusique, setAudioMusique] = useState<Blob | null>(null);
  const [loadingMusique, setLoadingMusique] = useState(false);

  // Charger les voix disponibles au montage
  useEffect(() => {
    getVoix().then(d => setVoixDispo(d.voix)).catch(() => {});
  }, []);

  // ── Handlers STT ─────────────────────────────────────────
  function handleFichier(f: File) {
    setFichierAudio(f);
    setTranscription('');
  }

  async function handleTranscrire() {
    if (!fichierAudio) return;
    setLoadingStt(true);
    try {
      const data = await transcrireAudio(fichierAudio);
      setTranscription(data.transcription);
    } catch (e: unknown) {
      setToast({ msg: e instanceof Error ? e.message : 'Erreur transcription', type: 'error' });
    } finally {
      setLoadingStt(false);
    }
  }

  // ── Handlers TTS ─────────────────────────────────────────
  async function handleSynthetiser() {
    if (!texteTts.trim()) return;
    setLoadingTts(true);
    setAudioVoix(null);
    try {
      const blob = await synthetiserVoix(texteTts, voixId);
      setAudioVoix(blob);
      setDerniereVoix(URL.createObjectURL(blob));
      setToast({ msg: 'Synthèse vocale réussie !', type: 'success' });
    } catch (e: unknown) {
      setToast({ msg: e instanceof Error ? e.message : 'Erreur TTS', type: 'error' });
    } finally {
      setLoadingTts(false);
    }
  }

  // ── Handlers Musique ─────────────────────────────────────
  async function handleGenererMusique() {
    if (!promptMusique.trim()) return;
    setLoadingMusique(true);
    setAudioMusique(null);
    try {
      const blob = await genererMusique(promptMusique, duree);
      setAudioMusique(blob);
      setDerniereMusique(URL.createObjectURL(blob));
      setToast({ msg: 'Musique générée !', type: 'success' });
    } catch (e: unknown) {
      setToast({ msg: e instanceof Error ? e.message : 'Erreur génération musicale', type: 'error' });
    } finally {
      setLoadingMusique(false);
    }
  }

  const tabs: { id: SousOnglet; label: string; icon: string }[] = [
    { id: 'stt',     label: 'Transcription',    icon: '◉' },
    { id: 'tts',     label: 'Synthèse vocale',   icon: '◎' },
    { id: 'musique', label: 'Génération musicale', icon: '♪' },
  ];

  return (
    <div className="ether-animate-fade-in">
      <div className="ether-flex-between ether-mb-lg">
        <div>
          <h1 className="ether-h1">Audio & Voix</h1>
          <p className="ether-body-sm ether-mt-sm">
            Transcription, synthèse et création musicale
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="ether-tag ether-tag-violet">Whisper · Edge-TTS</span>
          <span className="ether-tag ether-tag-cyan">MusicGen</span>
        </div>
      </div>

      {/* Sous-onglets */}
      <div className="ether-tabs" style={{ marginBottom: '28px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className="ether-tab"
            data-active={sousOnglet === t.id ? 'true' : undefined}
            onClick={() => setSousOnglet(t.id)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ══ STT ══════════════════════════════════════════════ */}
      {sousOnglet === 'stt' && (
        <div className="ether-grid-2 ether-animate-fade-in" style={{ gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="ether-card-elevated">
              <label className="ether-field-label">Fichier audio à transcrire</label>
              <p className="ether-body-sm ether-mb-md">MP3, WAV, WEBM, M4A — max 25 Mo</p>

              {/* Zone de drop */}
              <div
                className={`ether-upload-zone${dragging ? ' drag-over' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFichier(f);
                }}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px', opacity: 0.5 }}>◉</span>
                {fichierAudio
                  ? <p className="ether-body" style={{ color: 'var(--ether-violet-light)' }}>{fichierAudio.name}</p>
                  : <p className="ether-body-sm">Dépose ton fichier ici ou clique pour parcourir</p>
                }
                <input
                  ref={inputRef}
                  type="file"
                  accept=".mp3,.wav,.webm,.m4a,.ogg,.flac"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) handleFichier(e.target.files[0]); }}
                />
              </div>

              <button
                className="ether-btn ether-btn-primary ether-btn-full"
                style={{ marginTop: '16px' }}
                disabled={!fichierAudio || loadingStt}
                onClick={handleTranscrire}
              >
                {loadingStt ? 'Transcription...' : '◉ Transcrire'}
              </button>
            </div>
          </div>

          <div className="ether-card-elevated" style={{ minHeight: '300px' }}>
            <div className="ether-flex-between ether-mb-md">
              <label className="ether-field-label">Transcription</label>
              {transcription && (
                <button
                  className="ether-btn ether-btn-sm ether-btn-ghost"
                  onClick={() => navigator.clipboard.writeText(transcription)}
                >
                  ⎘ Copier
                </button>
              )}
            </div>

            {loadingStt && (
              <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <Waveform active />
                <Spinner label="Transcription Whisper en cours..." />
              </div>
            )}

            {!loadingStt && !transcription && (
              <div style={{ textAlign: 'center', paddingTop: '60px', opacity: 0.3 }}>
                <Waveform active={false} />
                <p className="ether-body-sm" style={{ marginTop: '16px' }}>
                  La transcription apparaîtra ici
                </p>
              </div>
            )}

            {transcription && !loadingStt && (
              <p className="ether-animate-fade-in" style={{
                whiteSpace: 'pre-wrap', lineHeight: 1.8,
                color: 'var(--ether-text-secondary)', fontSize: '14px',
              }}>
                {transcription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ══ TTS ══════════════════════════════════════════════ */}
      {sousOnglet === 'tts' && (
        <div className="ether-grid-2 ether-animate-fade-in" style={{ gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="ether-card-elevated">
              <label className="ether-field-label">Voix</label>
              <select
                className="ether-select ether-mb-md"
                value={voixId}
                onChange={e => setVoixId(e.target.value)}
              >
                {voixDispo.length > 0
                  ? voixDispo.map(v => <option key={v.id} value={v.id}>{v.label}</option>)
                  : (
                    <>
                      <option value="fr-FR-DeniseNeural">Denise (FR, femme)</option>
                      <option value="fr-FR-HenriNeural">Henri (FR, homme)</option>
                      <option value="fr-BE-CharlineNeural">Charline (BE, femme)</option>
                      <option value="en-US-JennyNeural">Jenny (EN, femme)</option>
                    </>
                  )
                }
              </select>

              <label className="ether-field-label">Texte à lire</label>
              <textarea
                className="ether-prompt-area"
                rows={6}
                placeholder="Saisis le texte que tu veux transformer en voix..."
                value={texteTts}
                onChange={e => setTexteTts(e.target.value)}
              />

              <button
                className="ether-btn ether-btn-primary ether-btn-full"
                style={{ marginTop: '16px' }}
                disabled={!texteTts.trim() || loadingTts}
                onClick={handleSynthetiser}
              >
                {loadingTts ? 'Synthèse...' : '◎ Synthétiser'}
              </button>
            </div>
          </div>

          <div className="ether-card-elevated" style={{ minHeight: '300px' }}>
            <label className="ether-field-label ether-mb-md">Résultat audio</label>

            {loadingTts && (
              <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <Waveform active />
                <Spinner label="Synthèse vocale en cours..." />
              </div>
            )}

            {!loadingTts && !audioVoix && (
              <div style={{ textAlign: 'center', paddingTop: '60px', opacity: 0.3 }}>
                <Waveform active={false} />
                <p className="ether-body-sm" style={{ marginTop: '16px' }}>
                  L&apos;audio synthétisé apparaîtra ici
                </p>
              </div>
            )}

            {audioVoix && !loadingTts && (
              <AudioPlayer blob={audioVoix} filename="voix-ether.mp3" />
            )}
          </div>
        </div>
      )}

      {/* ══ MUSIQUE ══════════════════════════════════════════ */}
      {sousOnglet === 'musique' && (
        <div className="ether-grid-2 ether-animate-fade-in" style={{ gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="ether-card-elevated">
              <label className="ether-field-label">Description musicale</label>
              <textarea
                className="ether-prompt-area"
                rows={5}
                placeholder="Ex: ambient electronic, slow pads, melancholic, cinematic, 120 bpm..."
                value={promptMusique}
                onChange={e => setPromptMusique(e.target.value)}
              />

              <label className="ether-field-label" style={{ marginTop: '20px' }}>
                Durée : <span style={{ color: 'var(--ether-violet-light)' }}>{duree}s</span>
              </label>
              <input
                type="range"
                className="ether-slider"
                min={5} max={30} step={1}
                value={duree}
                onChange={e => setDuree(Number(e.target.value))}
                style={{ marginTop: '8px' }}
              />
              <div className="ether-flex-between" style={{ marginTop: '4px' }}>
                <span className="ether-body-sm">5s</span>
                <span className="ether-body-sm">30s</span>
              </div>

              <div
                className="ether-card"
                style={{ marginTop: '16px', background: 'var(--ether-cyan-faint)', borderColor: 'var(--ether-cyan-border)' }}
              >
                <p className="ether-body-sm" style={{ color: 'var(--ether-cyan)' }}>
                  ♪ MusicGen (Meta / HuggingFace) — génération IA réelle.
                  Peut prendre 15–45 secondes selon la charge serveur.
                </p>
              </div>

              <button
                className="ether-btn ether-btn-cyan ether-btn-full"
                style={{ marginTop: '16px' }}
                disabled={!promptMusique.trim() || loadingMusique}
                onClick={handleGenererMusique}
              >
                {loadingMusique ? 'Génération...' : '♪ Composer'}
              </button>
            </div>
          </div>

          <div className="ether-card-elevated" style={{ minHeight: '300px' }}>
            <label className="ether-field-label ether-mb-md">Musique générée</label>

            {loadingMusique && (
              <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <Waveform active />
                <Spinner label="Composition en cours... (30–45s)" />
                <div className="ether-progress-track" style={{ marginTop: '20px' }}>
                  <div
                    className="ether-progress-fill"
                    style={{ width: '60%', animation: 'ether-shimmer 2s infinite' }}
                  />
                </div>
              </div>
            )}

            {!loadingMusique && !audioMusique && (
              <div style={{ textAlign: 'center', paddingTop: '60px', opacity: 0.3 }}>
                <Waveform active={false} />
                <p className="ether-body-sm" style={{ marginTop: '16px' }}>
                  La musique générée apparaîtra ici
                </p>
              </div>
            )}

            {audioMusique && !loadingMusique && (
              <>
                <AudioPlayer blob={audioMusique} filename="musique-ether.wav" />
                <div className="ether-card ether-mt-md" style={{ borderColor: 'var(--ether-cyan-border)' }}>
                  <p className="ether-label ether-mb-sm">Prompt utilisé</p>
                  <p className="ether-body-sm" style={{ fontStyle: 'italic' }}>{promptMusique}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
