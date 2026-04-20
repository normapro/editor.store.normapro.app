import Header from "../components/layout/Header";

export default function ActualidadPage() {
  return (
    <>
      <Header title="Actualidad" subtitle="Página de ejemplo" />
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-3xl font-bold text-text-primary">Hola</h2>
        </div>
      </main>
    </>
  );
}
