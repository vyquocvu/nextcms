import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <nav className="flex flex-col space-y-2">
          <Button variant="link" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/admin/profile">Profile</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/admin/posts">Posts</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/admin/collections">Collections</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/admin/content">Content</Link>
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
