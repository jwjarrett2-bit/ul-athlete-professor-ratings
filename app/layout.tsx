import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthButton } from "@/components/auth-button";
import { Providers } from "@/app/providers";
import { isAdminEmail } from "@/lib/admin";
import { authOptions } from "@/lib/auth";
import { isBetaReviewModeEnabled } from "@/lib/beta";
import "./globals.css";

export const metadata: Metadata = {
  title: "UL Athlete Professor Ratings",
  description: "Professor recommendations built for University of Louisiana student-athletes."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAdmin = isAdminEmail(session?.user?.email);
  const betaReviewMode = isBetaReviewModeEnabled();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <header className="border-b border-cypress/10 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded bg-vermilion text-sm font-black text-white shadow-sm">
                  UL
                </span>
                <span>
                  <span className="block text-sm font-bold uppercase tracking-wide text-cypress">
                    Athlete Course Guide
                  </span>
                  <span className="block text-xs text-cypress/65">University of Louisiana</span>
                </span>
              </Link>
              <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-semibold text-cypress/75">
                <Link className="rounded px-3 py-2 hover:bg-cypress/5" href="/professors">
                  Professors
                </Link>
                <Link className="rounded bg-cypress px-3 py-2 text-white hover:bg-cypress/90" href="/professors">
                  Find Professors
                </Link>
                <AuthButton betaReviewMode={betaReviewMode} />
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-cypress/10 bg-white/70">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm font-semibold text-cypress/65 sm:flex-row sm:items-center sm:justify-between">
              <p>Unofficial athlete-focused course intel for UL students.</p>
              <nav className="flex flex-wrap gap-3">
                <Link className="hover:text-vermilion" href="/professors">
                  Professors
                </Link>
                <Link className="hover:text-vermilion" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-vermilion" href="/terms">
                  Terms
                </Link>
                {isAdmin ? (
                  <>
                    <Link className="hover:text-vermilion" href="/admin/reviews">
                      Review Admin
                    </Link>
                    <Link className="hover:text-vermilion" href="/admin/professors">
                      Professor Admin
                    </Link>
                  </>
                ) : null}
              </nav>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
