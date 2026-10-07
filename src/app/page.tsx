import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4">
      <nav className="absolute top-0 right-0 flex gap-4 p-6">
        <Link href="/login" className="text-sm font-medium hover:underline">
          Log in
        </Link>
        <Link href="/signup" className="text-sm font-medium hover:underline">
          Sign up
        </Link>
      </nav>

      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-semibold tracking-tight">
          Welcome
        </h1>
        <p className="mt-3 font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-medium">
          Selplify
        </p>
        <p className="mt-4 text-muted-foreground text-lg">
          A marketplace for independent sellers.
        </p>
      </div>
    </div>
  );
}