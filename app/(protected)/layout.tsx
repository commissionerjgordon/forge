import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-72">{children}</main>
    </div>
  );
}
