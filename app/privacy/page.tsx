export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-5">
      <p className="text-sm font-black uppercase text-vermilion">Launch basics</p>
      <h1 className="mt-2 text-4xl font-black text-cypress">Privacy Policy</h1>
      <div className="mt-6 space-y-5 rounded border border-cypress/10 bg-white p-6 leading-7 text-cypress/75 shadow-sm">
        <p>
          This unofficial MVP uses Google login so student-athletes can submit reviews and avoid duplicate
          course reviews. We store the name, email, and profile image Google provides, plus reviews you submit.
        </p>
        <p>
          Reviews are public unless hidden by an admin. Admins may see review status, report reasons, and the
          account that submitted a review for moderation purposes.
        </p>
        <p>
          Do not submit private information about yourself, professors, or other students. This site is for
          athlete-focused course planning feedback only.
        </p>
      </div>
    </main>
  );
}
