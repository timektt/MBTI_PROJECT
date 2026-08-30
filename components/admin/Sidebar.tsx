// components/admin/Sidebar.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils"; // 🔧 ถ้ายังไม่มี cn() utility → ใช้ clsx หรือสร้างเอง

export default function Sidebar() {
  const { pathname } = useRouter();

  const links = [
    { label: "Dashboard", href: "/admin" },
    { label: "Cards", href: "/admin/cards" },
    { label: "Comments", href: "/admin/comments" },
    { label: "Users", href: "/admin/users" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-4">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "block px-4 py-2 rounded hover:bg-gray-700",
              pathname === href && "bg-gray-700 font-semibold"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
