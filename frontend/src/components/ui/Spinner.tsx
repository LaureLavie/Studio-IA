interface SpinnerProps { label?: string; size?: 'sm' | 'md' }

export default function Spinner({ label = 'Génération en cours...', size = 'md' }: SpinnerProps) {
  return (
    <div className="ether-flex-center ether-gap-sm" style={{ padding: '12px 0' }}>
      <div className={`ether-spinner${size === 'sm' ? '' : ''}`} />
      <span className="ether-body-sm">{label}</span>
    </div>
  );
}
