import Navbar from '@/components/layout/Navbar';
import { StudioProvider } from '@/lib/studioContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <Navbar />
      <main className="ether-container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        {children}
      </main>
    </StudioProvider>
  );
}
