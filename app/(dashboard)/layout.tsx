import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-primary-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
