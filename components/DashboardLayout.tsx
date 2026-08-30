import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <SidebarLeft />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 p-6">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <SidebarRight />
      </aside>
    </div>
  );
}
