import { Sidebar } from "@/components/layout/sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-8">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Good morning, {user?.firstName || "there"} 👋
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Here's what's happening with your projects today.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Active Projects", value: "12", change: "+2 this week" },
            { label: "Tasks Due Today", value: "7", change: "3 overdue" },
            { label: "Completion Rate", value: "84%", change: "+5%" },
            { label: "Team Members", value: "24", change: "3 online" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-4xl font-semibold mt-3 mb-1">{stat.value}</p>
              <p className="text-xs text-emerald-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-3xl p-10 text-center">
          <p className="text-2xl font-medium">Welcome to Forge!</p>
          <p className="text-muted-foreground mt-3">
            You are signed in as{" "}
            <strong>{user?.primaryEmailAddress?.emailAddress}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
