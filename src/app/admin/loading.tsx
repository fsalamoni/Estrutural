export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-secondary" />
        <p className="font-label text-xs text-on-primary-container uppercase tracking-widest">
          Carregando painel...
        </p>
      </div>
    </div>
  );
}
