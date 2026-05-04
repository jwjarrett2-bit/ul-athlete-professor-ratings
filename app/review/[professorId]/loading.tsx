export default function ReviewLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="h-4 w-36 rounded bg-vermilion/20" />
      <div className="mt-6 rounded border border-cypress/10 bg-white p-6">
        <div className="h-4 w-28 rounded bg-vermilion/20" />
        <div className="mt-3 h-10 w-full max-w-md rounded bg-cypress/10" />
        <div className="mt-3 h-5 w-full max-w-lg rounded bg-cypress/10" />
      </div>
      <div className="mt-6 rounded border border-cypress/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-11 rounded bg-cypress/10" key={item} />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div className="h-14 rounded bg-cypress/5" key={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
