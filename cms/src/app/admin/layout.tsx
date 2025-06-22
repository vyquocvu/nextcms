import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <nav className="flex flex-col space-y-2">
          <Link className="hover:underline" href="/admin">
            Dashboard
          </Link>
          <Link className="hover:underline" href="/admin/profile">
            Profile
          </Link>
          <Link className="hover:underline" href="/admin/settings">
            Settings
          </Link>
          <Link className="hover:underline" href="/admin/posts">
            Posts
          </Link>
          <Link className="hover:underline" href="/admin/collections">
            Collections
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
