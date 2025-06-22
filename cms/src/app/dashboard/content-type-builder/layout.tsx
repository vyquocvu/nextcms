import Link from 'next/link';

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-48 p-4 bg-gray-50 dark:bg-gray-800">
        <nav className="flex flex-col space-y-2 text-sm">
          <Link href="/dashboard/content-type-builder/collection-types" className="hover:underline">
            Collection Types
          </Link>
          <Link href="/dashboard/content-type-builder/single-types" className="hover:underline">
            Single Types
          </Link>
          <Link href="/dashboard/content-type-builder/components" className="hover:underline">
            Components
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
