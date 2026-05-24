import { loginAdmin } from "../actions";

type SearchParams = Promise<{ error?: string }>;

export const metadata = { title: "Admin login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-extrabold text-center">Admin login</h1>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Enter the credentials set in <code>ADMIN_EMAIL</code> and{" "}
        <code>ADMIN_PASSWORD</code>.
      </p>
      <form action={loginAdmin} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            autoFocus
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Password</span>
          <input
            type="text"
            name="password"
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </label>
        {error ? (
          <p className="text-xs text-destructive">Incorrect email or password.</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
