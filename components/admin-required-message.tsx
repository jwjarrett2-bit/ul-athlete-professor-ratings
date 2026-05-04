export function AdminRequiredMessage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-5">
      <section className="rounded border border-cypress/10 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-black uppercase text-vermilion">Admin access</p>
        <h1 className="mt-2 text-3xl font-black text-cypress">Not authorized</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-cypress/70">
          Log in with a Google account listed in <span className="font-bold">ADMIN_EMAILS</span> to use
          launch admin tools.
        </p>
      </section>
    </main>
  );
}
