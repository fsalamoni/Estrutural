import ErrorBoundary from '@/components/ui/ErrorBoundary';
import InstructionsPanel from '@/components/admin/InstructionsPanel';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata = {
  title: 'Painel Admin — Plataformas Salomone',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ErrorBoundary fallback={null}>
        <InstructionsPanel />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <ToastContainer />
      </ErrorBoundary>
    </>
  );
}
