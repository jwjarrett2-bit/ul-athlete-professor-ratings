export default function ProfessorsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="max-w-2xl">
        <div className="h-4 w-36 rounded bg-vermilion/20" />
        <div className="mt-3 h-10 w-full max-w-xl rounded bg-cypress/10" />
        <div className="mt-3 h-5 w-full max-w-lg rounded bg-cypress/10" />
      </div>
      <div className="mt-6 rounded border border-cypress/10 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_190px_auto]">
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-cypress/10" />
          <div className="h-11 rounded bg-vermilion/20" />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm" key={item}>
            <div className="h-4 w-32 rounded bg-vermilion/20" />
            <div className="mt-3 h-8 w-52 rounded bg-cypress/10" />
            <div className="mt-3 h-4 w-44 rounded bg-cypress/10" />
            <div className="mt-8 flex gap-2">
              <div className="h-7 w-24 rounded bg-field-gold/25" />
              <div className="h-7 w-20 rounded bg-cypress/10" />
              <div className="h-7 w-20 rounded bg-cypress/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
