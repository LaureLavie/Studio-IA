'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface StudioState {
  derniereImage: string | null;
  dernierTexte: string | null;
  derniereMusique: string | null;
  derniereVoix: string | null;
  setDerniereImage: (url: string) => void;
  setDernierTexte: (t: string) => void;
  setDerniereMusique: (url: string) => void;
  setDerniereVoix: (url: string) => void;
}

const StudioContext = createContext<StudioState | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [derniereImage, setDerniereImage] = useState<string | null>(null);
  const [dernierTexte, setDernierTexte] = useState<string | null>(null);
  const [derniereMusique, setDerniereMusique] = useState<string | null>(null);
  const [derniereVoix, setDerniereVoix] = useState<string | null>(null);

  return (
    <StudioContext.Provider value={{
      derniereImage, dernierTexte, derniereMusique, derniereVoix,
      setDerniereImage, setDernierTexte: setDernierTexte,
      setDerniereMusique, setDerniereVoix,
    }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio doit être utilisé dans StudioProvider');
  return ctx;
}
