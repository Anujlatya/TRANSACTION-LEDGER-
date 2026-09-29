import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050816]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-72">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}