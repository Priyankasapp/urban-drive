"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

// ✅ Define error type
type ErrorWithMessage = {
  message: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful! Redirecting...");

      // ✅ Redirect based on role
      const role = data.user?.role || "";
      if (role === "super_admin" || role === "admin" || role === "manager") {
        setTimeout(() => router.push("/admin"), 500);
      } else {
        setTimeout(() => router.push("/"), 500);
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send recovery email");
      }

      setSuccess("Recovery link sent to your email!");
      setEmail("");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to send recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-8 md:p-16 bg-background text-text-primary">
      {/* ================= CENTER AUTH CONTAINER ================= */}
      <div className="w-full max-w-105 mx-auto my-auto py-10 md:py-0">
        {view === "login" ? (
          /* ================= LOGIN VIEW ================= */
          <div className="animate-fade-in">
            <header className="form-animate-item mb-10 text-center md:text-left">
              <h2 className="text-3xl font-normal tracking-tight text-text-primary mb-2">
                Executive Portal
              </h2>
              <p className="text-sm text-text-secondary tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-outline" />
                Secure verification for authorized personnel.
              </p>
            </header>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Custom Interactive Floating Label Email Input */}
              <div className="form-animate-item relative group">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full py-3.5 bg-transparent border-b border-border focus:border-primary text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Corporate Email"
                  disabled={loading}
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3.5 text-sm text-text-secondary pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full py-3.5 pr-10 bg-transparent border-b border-border focus:border-primary text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Security Key"
                  disabled={loading}
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-3.5 text-sm text-text-secondary pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs"
                >
                  Security Key
                </label>
              </div>

              {/* Remember Access & Forgot Password Block */}
              <div className="form-animate-item flex items-center justify-between pt-2 pb-4 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors select-none">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-0 cursor-pointer accent-black"
                  />
                  Remember Access
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  Forgot Password
                </button>
              </div>

              {/* Premium Corporate Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="form-animate-item w-full py-4 bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99] transition-all duration-300 text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "AUTHENTICATING..." : "AUTHENTICATE ACCESS"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* ================= FORGOT PASSWORD VIEW ================= */
          <div className="animate-fade-in">
            <header className="form-animate-item mb-10 text-center md:text-left">
              <h2 className="text-3xl font-normal tracking-tight text-text-primary mb-2">
                Reset Access
              </h2>
              <p className="text-sm text-text-secondary tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <KeyRound className="w-4 h-4 text-outline" />
                Enter your credentials to receive recovery instructions.
              </p>
            </header>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleForgotPassword}>
              {/* Custom Interactive Floating Label Email Input */}
              <div className="form-animate-item relative group">
                <input
                  type="email"
                  id="forgot-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full py-3.5 bg-transparent border-b border-border focus:border-primary text-sm outline-none transition-colors duration-300 placeholder-transparent"
                  placeholder="Corporate Email"
                  disabled={loading}
                />
                <label
                  htmlFor="forgot-email"
                  className="absolute left-0 top-3.5 text-sm text-text-secondary pointer-events-none transition-all duration-300 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs"
                >
                  Corporate Email
                </label>
              </div>

              {/* Premium Corporate Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="form-animate-item w-full py-4 bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99] transition-all duration-300 text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "SENDING..." : "SEND RECOVERY LINK"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back to Login Button */}
            <div className="form-animate-item text-center mt-8">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
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
