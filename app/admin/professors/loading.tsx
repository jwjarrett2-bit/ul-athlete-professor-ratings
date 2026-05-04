export default function AdminProfessorsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="h-4 w-24 rounded bg-vermilion/20" />
      <div className="mt-3 h-10 w-full max-w-md rounded bg-cypress/10" />
      <div className="mt-3 h-5 w-full max-w-xl rounded bg-cypress/10" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm" key={item}>
            <div className="h-6 w-48 rounded bg-cypress/10" />
            <div className="mt-3 h-4 w-full max-w-sm rounded bg-cypress/10" />
            <div className="mt-5 flex gap-2">
              <div className="h-10 w-24 rounded bg-vermilion/20" />
              <div className="h-10 w-24 rounded bg-cypress/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
