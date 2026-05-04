export default function NotListedLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="h-4 w-40 rounded bg-vermilion/20" />
      <section className="mt-6 rounded border border-cypress/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="h-4 w-40 rounded bg-vermilion/20" />
        <div className="mt-3 h-9 w-full max-w-md rounded bg-cypress/10" />
        <div className="mt-3 h-5 w-full max-w-lg rounded bg-cypress/10" />
        <div className="mt-6 grid gap-4">
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-vermilion/20" />
        </div>
      </section>
    </main>
  );
}
