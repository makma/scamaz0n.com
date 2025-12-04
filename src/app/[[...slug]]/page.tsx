"use client";

import { FormEvent, useState } from "react";
import { useParams, usePathname } from "next/navigation";

type LoginResponse = {
  message: string;
  [key: string]: unknown;
};

function randomEmail() {
  const inboxes = [
    "headless.bot",
    "selenium.runner",
    "tor-browser-user",
    "incognito-tab",
    "vpn-enjoyer",
    "proxy.chain",
    "cookie-tamperer",
    "suspicious-login",
    "high-risk-device",
    "fraud-monitor",
    "velocity-spammer",
    "suspicious.behavior",
    "device-farm-node",
    "credential-stuffer",
  ];
  const domains = [
    "torland.net",
    "vpntunnels.io",
    "incognito.cloud",
    "bot-traffic.lol",
    "risky-login.dev",
    "tamperlab.app",
  ];
  const name = inboxes[Math.floor(Math.random() * inboxes.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function randomPassword() {
  const phrases = [
    "correct-horse-battery-staple",
    "password123",
    "hunter2",
    "letmein!",
    "fingerprint-ftw",
  ];
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${phrases[Math.floor(Math.random() * phrases.length)]}-${suffix}`;
}

export default function LoginPage() {
  const pathname = usePathname() || "/";
  const params = useParams<{ slug?: string[] }>();
  const apiPath = `/api${pathname === "/" ? "" : pathname}`;

  // TODO: replace this placeholder with a concrete dashboard deep-link
  // once it's known (e.g., including a session or visitor id).
  const fingerprintDashboardUrl = "#";

  const [email, setEmail] = useState(() => randomEmail());
  const [password, setPassword] = useState(() => randomPassword());
  const [loading, setLoading] = useState(false);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<LoginResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const slugValue = params?.slug;
  const slugPath = Array.isArray(slugValue)
    ? slugValue.join("/")
    : typeof slugValue === "string"
    ? slugValue
    : "";
  const prettyRoute = slugPath || "login";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorText(null);
    setResponseBody(null);
    setHttpStatus(null);

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          meta: {
            pagePath: pathname,
          },
        }),
      });

      const json = (await res.json().catch(() => null)) as LoginResponse | null;

      setHttpStatus(res.status);
      setResponseBody(
        json ?? {
          message: "No JSON body returned from server",
        }
      );
    } catch (err) {
      setErrorText(
        err instanceof Error ? err.message : "Unexpected error during login"
      );
    } finally {
      setLoading(false);
    }
  }

  const statusColor =
    httpStatus == null
      ? "badge-neutral"
      : httpStatus >= 200 && httpStatus < 300
      ? "badge-success"
      : httpStatus >= 400 && httpStatus < 500
      ? "badge-warning"
      : "badge-danger";
  const isSuccessful =
    httpStatus != null && httpStatus >= 200 && httpStatus < 300;

  return (
    <div className="min-h-screen bg-scmz-grid flex items-center justify-center px-4">
      <main className="scmz-shell">
        <header className="scmz-header">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-1">
              <span className="scmz-logo">
                sc<span className="text-scmz-orange">a</span>maz0n
              </span>
              <span className="scmz-logo-mark" />
            </div>
            <span className="scmz-tagline">
              fake login • real Fingerprint signals
            </span>
          </div>
          <div className="scmz-env-pill">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              User Sandbox Route
            </span>
            <span className="text-xs font-mono text-slate-100">
              /{prettyRoute}
            </span>
          </div>
        </header>

        {prettyRoute === "login" && (
          <section className="mb-6 rounded-xl border border-amber-400/70 bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-amber-500/10 px-4 py-4 text-xs sm:text-sm text-amber-50 flex flex-col gap-2 shadow-lg shadow-amber-500/25">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono tracking-wide uppercase text-[11px] text-amber-200">
                You Found the Scamaz0n Sandbox
              </span>
              <span className="rounded-full border border-amber-300/70 bg-amber-400/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-950">
                Step 1: Get Access
              </span>
            </div>
            <p className="leading-snug">
              We didn&apos;t really expect anyone to just wander onto this URL.
              This Scamaz0n login is normally auto‑provisioned for new{" "}
              <span className="font-mono text-scmz-orange">Fingerprint</span>{" "}
              users so they can see identification and smart signals in action
              without touching production code.
            </p>
            <p className="leading-snug">
              If you don&apos;t have a Fingerprint account yet, your next move
              is simple:{" "}
              <a
                href="https://fingerprint.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline decoration-dotted underline-offset-2 text-scmz-orange"
              >
                go to fingerprint.com and sign up
              </a>
              . Once you&apos;re in, we&apos;ll auto‑wire a private sandbox
              route like this one straight into your dashboard so you can tune
              rules, run experiments, and watch events roll in for your own
              “fraudulent” logins.
            </p>
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
          {/* Login Card */}
          <div className="scmz-card">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Sign in to your{" "}
                <span className="text-scmz-orange">Scamaz0n</span> account
              </h1>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  Fingerprint Sandbox
                </span>
                <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-mono text-emerald-300 border border-emerald-400/30">
                  Fingerprint Connected
                </span>
              </div>
            </div>

            <div className="mb-4 space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                  Scamaz0n Prime-ish
                </span>
                <span className="text-[11px] text-amber-700">
                  Free phishing delivery in 2–3 business clicks.
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                ★★★★☆ 4.9 fake security rating · 2,048,312 compromised carts
                and counting.
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-800"
                >
                  Email (fake, but observable)
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="scmz-input"
                  placeholder="victim@totally-legit-bank.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-800"
                >
                  Password (also fake)
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="scmz-input"
                  placeholder="correct-horse-battery-staple-123"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="scmz-button w-full"
              >
                {loading ? "Contacting Fingerprint…" : "Sign in"}
              </button>

              {responseBody && (
                <div
                  className={`mt-3 rounded-md px-3 py-2 text-xs shadow-sm border ${
                    isSuccessful
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-red-500/70 bg-red-50"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-slate-700">
                      Scamaz0n notice
                    </span>
                  </div>
                  <div
                    className={`text-[12px] sm:text-[13px] font-semibold ${
                      isSuccessful ? "text-emerald-800" : "text-red-800"
                    }`}
                  >
                    {String(responseBody.message ?? "—")}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Response / Telemetry Panel */}
          <div className="scmz-card bg-slate-950 text-slate-50">
            <div className="h-px w-full bg-gradient-to-r from-sky-500/40 via-violet-500/60 to-emerald-400/40 mb-3" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                Fingerprint Session Inspector
              </h2>
              <div className={`badge ${statusColor}`}>
                <span className="font-mono text-[11px] whitespace-nowrap">
                  {httpStatus == null ? "NO REQUEST YET" : `HTTP ${httpStatus}`}
                </span>
              </div>
            </div>

            {errorText && (
              <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-50">
                <div className="font-mono mb-1 text-[11px]">CLIENT ERROR</div>
                <div>{errorText}</div>
              </div>
            )}

            {!responseBody && !errorText && (
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit the login form to see how{" "}
                <span className="font-mono">Fingerprint</span>–backed logic
                shapes the response. This panel always expects a JSON payload
                like:
                <br />
                <span className="font-mono text-[11px]">
                  {"{"} &quot;message&quot;: &quot;Login succeeded&quot;, ... {"}"}
                </span>
              </p>
            )}

            {responseBody && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wide text-slate-400">
                    message
                  </span>
                  <span className="text-xs font-semibold text-slate-50">
                    {String(responseBody.message ?? "—")}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono uppercase tracking-wide">
                      Raw JSON
                    </span>
                    <span className="font-mono text-slate-500">
                      /api{pathname === "/" ? "" : pathname}
                    </span>
                  </div>
                  <pre className="scmz-json">
                    {JSON.stringify(responseBody, null, 2)}
                  </pre>
                </div>

                <div className="pt-2 border-t border-slate-800/60 mt-2 flex flex-col gap-2">
                  <p className="text-[11px] text-slate-100 leading-snug">
                    {isSuccessful ? (
                      <>
                        <span className="block mb-0.5 font-semibold text-emerald-300">
                          This {httpStatus} response is currently allowed — but
                          should this session really be welcome?
                        </span>
                      </>
                    ) : (
                      <>
                        This{" "}
                        <span className="font-mono text-red-400">
                          {httpStatus}
                        </span>{" "}
                        response suggests a suspicious or blocked attempt. Open
                        your{" "}
                        <span className="font-mono">Fingerprint</span> dashboard
                        to investigate this session, review identification
                        events, and tune your rules.
                      </>
                    )}
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-1">
                    <a
                      href={fingerprintDashboardUrl}
                      className="scmz-button whitespace-nowrap px-4 py-1.5 text-[11px]"
                    >
                      Explore identification event
                    </a>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                      And then…
                    </span>
                    <button
                      type="button"
                      className="scmz-button whitespace-nowrap px-4 py-1.5 text-[11px] bg-transparent text-amber-200 border border-amber-400/80 shadow-none hover:bg-amber-500/10 hover:text-amber-100"
                    >
                      Configure rules that stop malicious users
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


