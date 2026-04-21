import Header from "../../components/layout/Header";

export default function InformesPage() {
  return (
    <>
      <Header title="Informes" subtitle="Pagina de ejemplo" />
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-3xl font-bold text-text-primary">Hola</h2>
        </div>
      </main>
    </>
  );
}
