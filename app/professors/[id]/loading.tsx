export default function ProfessorProfileLoading() {
  return (
    <main>
      <section className="border-b border-cypress/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
          <div className="h-4 w-40 rounded bg-vermilion/20" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="h-4 w-36 rounded bg-vermilion/20" />
              <div className="mt-3 h-12 w-full max-w-lg rounded bg-cypress/10" />
              <div className="mt-3 h-5 w-full max-w-xl rounded bg-cypress/10" />
              <div className="mt-6 h-11 w-32 rounded bg-vermilion/20" />
            </div>
            <div className="h-24 w-24 rounded bg-cypress/10" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="rounded border border-cypress/10 bg-white p-5" key={item}>
              <div className="h-4 w-32 rounded bg-vermilion/20" />
              <div className="mt-3 h-10 w-20 rounded bg-cypress/10" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
