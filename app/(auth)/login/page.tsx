"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "forgot">("login");

  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-8 md:p-16 bg-[var(--background)] text-[var(--text-primary)]">
      {/* ================= CENTER AUTH CONTAINER ================= */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-10 md:py-0">
        {view === "login" ? (
          /* ================= LOGIN VIEW ================= */
          <div className="animate-fade-in">
            <header className="form-animate-item mb-10 text-center md:text-left">
              <h2 className="text-3xl font-normal tracking-tight text-[var(--text-primary)] mb-2">
                Executive Portal
              </h2>
              <p className="text-sm text-[var(--text-secondary)] tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--outline)]" />
                Secure verification for authorized personnel.
              </p>
            </header>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Custom Interactive Floating Label Email Input */}
              <div className="form-animate-item relative group">
                <input
                  type="email"
                  id="email"
                  required
                  className="peer w-full py-3.5 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Corporate Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Corporate Email
                </label>
              </div>

              {/* Custom Interactive Floating Label Password Input */}
              <div className="form-animate-item relative group">
                <input
                  type="password"
                  id="password"
                  required
                  className="peer w-full py-3.5 pr-10 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Security Key"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Security Key
                </label>
              </div>

              {/* Remember Access & Forgot Password Block */}
              <div className="form-animate-item flex items-center justify-between pt-2 pb-4 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-0 cursor-pointer accent-black"
                  />
                  Remember Access
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  Forgot Password
                </button>
              </div>

              {/* Premium Corporate Submit Button */}
              <button
                type="submit"
                className="form-animate-item w-full py-4 bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)] active:scale-[0.99] transition-all duration-300 text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-2"
              >
                AUTHENTICATE ACCESS
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* ================= FORGOT PASSWORD VIEW ================= */
          <div className="animate-fade-in">
            <header className="form-animate-item mb-10 text-center md:text-left">
              <h2 className="text-3xl font-normal tracking-tight text-[var(--text-primary)] mb-2">
                Reset Access
              </h2>
              <p className="text-sm text-[var(--text-secondary)] tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <KeyRound className="w-4 h-4 text-[var(--outline)]" />
                Enter your credentials to receive recovery instructions.
              </p>
            </header>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Custom Interactive Floating Label Email Input */}
              <div className="form-animate-item relative group">
                <input
                  type="email"
                  id="forgot-email"
                  required
                  className="peer w-full py-3.5 bg-transparent border-b border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Corporate Email"
                />
                <label
                  htmlFor="forgot-email"
                  className="absolute left-0 top-3.5 text-sm text-[var(--text-secondary)] pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[var(--primary)]
                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Corporate Email
                </label>
              </div>

              {/* Premium Corporate Submit Button */}
              <button
                type="submit"
                className="form-animate-item w-full py-4 bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)] active:scale-[0.99] transition-all duration-300 text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-2"
              >
                SEND RECOVERY LINK
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back to Login Button */}
            <div className="form-animate-item text-center mt-8">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Executive Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
