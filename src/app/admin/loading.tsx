export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-border border-t-accent-purple" />
        <p className="text-sm text-gray-600">Carregando painel...</p>
      </div>
    </div>
  );
}
