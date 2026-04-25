import AuthGuard from '@/components/admin/AuthGuard';
import InstructionsPanel from '@/components/admin/InstructionsPanel';

export const metadata = {
  title: 'Painel Admin — Protagonista RPG',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
      <InstructionsPanel />
    </AuthGuard>
  );
}
