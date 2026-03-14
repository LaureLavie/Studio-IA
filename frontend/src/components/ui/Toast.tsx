'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
}

export default function Toast({ message, type = 'error', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const border = type === 'success'
    ? 'var(--ether-cyan-border)'
    : 'rgba(239,68,68,0.3)';

  const icon = type === 'success' ? '✓' : '✕';
  const color = type === 'success' ? 'var(--ether-cyan)' : '#f87171';

  return (
    <div
      className="ether-animate-fade-in"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
        background: 'var(--ether-bg-surface)',
        border: `1px solid ${border}`,
        borderRadius: 'var(--ether-radius-lg)',
        padding: '14px 18px',
        fontSize: '13px',
        color: 'var(--ether-text-secondary)',
        boxShadow: 'var(--ether-shadow-lg)',
        display: 'flex', alignItems: 'center', gap: '12px',
        minWidth: '260px', maxWidth: '380px',
      }}
    >
      <span style={{ color, fontWeight: 700, fontSize: '16px' }}>{icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--ether-text-muted)', fontSize: '16px' }}
      >×</button>
    </div>
  );
}
