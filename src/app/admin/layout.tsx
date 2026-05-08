import InstructionsPanel from '@/components/admin/InstructionsPanel';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata = {
  title: 'Painel Admin — Plataformas Salomone',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <InstructionsPanel />
      <ToastContainer />
    </>
  );
}
