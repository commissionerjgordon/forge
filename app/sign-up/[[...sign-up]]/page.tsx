import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-zinc-900 border border-zinc-800 shadow-xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-zinc-400',
              formButtonPrimary: 'bg-violet-600 hover:bg-violet-700',
            },
          }}
        />
      </div>
    </div>
  );
}
