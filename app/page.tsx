import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 to-slate-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-8">
          ✨ Forge Ahead
        </div>

        <h1 className="text-7xl font-bold tracking-tighter mb-6">
          Build better.
          <br />
          Together.
        </h1>
        <p className="text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Real-time collaborative project management with AI assistance.
        </p>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          No credit card required • Built with Next.js 15
        </p>
      </div>
    </div>
  );
}
