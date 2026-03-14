const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ── Types ─────────────────────────────────────────────────────
export interface TexteResponse  { texte: string }
export interface ImageResponse  { url: string; largeur: number; hauteur: number }
export interface TranscriptionResponse { transcription: string }
export interface VoixItem { id: string; label: string }

// ── Helper ────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
  return res.json();
}

// ── Texte ──────────────────────────────────────────────────────
export async function genererTexte(prompt: string, systeme?: string): Promise<TexteResponse> {
  const res = await fetch(`${API_BASE}/api/texte/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systeme }),
  });
  return handleResponse<TexteResponse>(res);
}

// ── Image ──────────────────────────────────────────────────────
export async function genererImage(
  prompt: string,
  largeur = 1024,
  hauteur = 1024
): Promise<ImageResponse> {
  const res = await fetch(`${API_BASE}/api/image/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, largeur, hauteur }),
  });
  return handleResponse<ImageResponse>(res);
}

// ── Audio — transcription ──────────────────────────────────────
export async function transcrireAudio(fichier: File): Promise<TranscriptionResponse> {
  const form = new FormData();
  form.append('fichier', fichier);
  const res = await fetch(`${API_BASE}/api/audio/transcrire`, {
    method: 'POST',
    body: form,
  });
  return handleResponse<TranscriptionResponse>(res);
}

// ── Audio — TTS ────────────────────────────────────────────────
export async function synthetiserVoix(texte: string, voix: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/audio/synthese-vocale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texte, voix }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
  return res.blob();
}

// ── Audio — Musique ────────────────────────────────────────────
export async function genererMusique(prompt: string, duree: number): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/audio/musique`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duree }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
  return res.blob();
}

// ── Liste voix disponibles ─────────────────────────────────────
export async function getVoix(): Promise<{ voix: VoixItem[] }> {
  const res = await fetch(`${API_BASE}/api/audio/voix`);
  return handleResponse<{ voix: VoixItem[] }>(res);
}
