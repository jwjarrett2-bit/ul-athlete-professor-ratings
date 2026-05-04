export default function AdminReviewsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="h-4 w-24 rounded bg-vermilion/20" />
      <div className="mt-3 h-10 w-full max-w-md rounded bg-cypress/10" />
      <div className="mt-3 h-5 w-full max-w-xl rounded bg-cypress/10" />
      <div className="mt-6 flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((item) => (
          <div className="h-10 w-24 rounded bg-cypress/10" key={item} />
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((item) => (
          <div className="rounded border border-cypress/10 bg-white p-5 shadow-sm" key={item}>
            <div className="h-6 w-48 rounded bg-cypress/10" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-cypress/10" />
            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((pill) => (
                <div className="h-7 rounded bg-cypress/5" key={pill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
