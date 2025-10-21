import { Inter } from "next/font/google";
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-6">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden mr-4">
          <MobileSidebar />
        </div>

        <h1 className="text-xl font-semibold">UniPay Dashboard</h1>

        <div className="ml-auto flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            {/* Notification Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-500"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">U</span>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full md:ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
