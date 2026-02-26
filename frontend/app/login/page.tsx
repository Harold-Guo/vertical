"use client";

import { createClient } from "@/lib/supabase/client";
import { AudioWaveform, Mic, Brain, Target } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const features = [
  { icon: Mic, text: "Smart Recording & Transcription" },
  { icon: Brain, text: "AI Coaching & Objection Handling" },
  { icon: Target, text: "MEDDIC Deal Assessment" },
];

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-[660px] bg-dark-sidebar flex-col justify-center px-20 py-16">
        <div className="space-y-8">
          <div className="w-[60px] h-1 rounded-full bg-page-accent" />

          <div className="flex items-center gap-3">
            <AudioWaveform className="w-9 h-9 text-page-accent" />
            <span className="font-heading text-[32px] font-bold text-text-light tracking-wide">
              PLAUD
            </span>
          </div>

          <h1 className="font-heading text-[28px] font-semibold text-text-light leading-snug max-w-[400px]">
            AI-Powered Sales Intelligence
          </h1>

          <p className="text-text-muted text-base leading-relaxed max-w-[440px]">
            Transform your sales conversations into actionable insights. Close
            deals faster with AI-driven coaching and real-time analysis.
          </p>

          <div className="space-y-5 pt-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-dark-surface flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-page-accent" />
                </div>
                <span className="text-[15px] font-medium text-[#BBBBBB]">
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-5 pt-4 opacity-15">
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={col} className="flex flex-col gap-5">
                {Array.from({ length: 3 }).map((_, row) => (
                  <div
                    key={row}
                    className="w-1.5 h-1.5 rounded-full bg-page-accent-light"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center bg-page px-8">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-9">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-[28px] font-bold text-text-primary">
              Welcome Back
            </h2>
            <p className="text-[15px] text-text-secondary">
              Sign in to your PLAUD account
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg border border-page-border bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <GoogleIcon />
            <span className="text-[15px] font-medium text-text-primary">
              Sign in with Google
            </span>
          </button>

          <p className="text-xs text-text-muted text-center max-w-[324px] mx-auto">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[13px]">
            <span className="text-text-muted">
              Don&apos;t have an account?
            </span>
            <span className="font-semibold text-page-accent">
              Contact Sales
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
