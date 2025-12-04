"use client";

import { FormEvent, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";

type LoginResponse = {
  message: string;
  [key: string]: unknown;
};

function randomEmail() {
  const names = [
    "mike.wheeler",
    "eleven.jane",
    "dustin.henderson",
    "lucas.sinclair",
    "will.byers",
    "max.mayfield",
    "steve.harrington",
    "nancy.wheeler",
    "jonathan.byers",
    "joyce.byers",
  ];
  const domains = [
    "hawkinslab.gov",
    "hawkinsindiana.net",
    "starcourt.mall",
    "upsidedown.io",
    "hawkinshigh.edu",
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function randomPassword() {
  const phrases = [
    "hawkins1983",
    "eleven011",
    "upsidedown",
    "demogorgon",
    "hawkinslab",
    "starcourt",
    "vecna1986",
  ];
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${phrases[Math.floor(Math.random() * phrases.length)]}${suffix}`;
}

export default function LoginPage() {
  const pathname = usePathname() || "/";
  const params = useParams<{ slug?: string[] }>();
  const searchParams = useSearchParams();
  const apiPath = `/api${pathname === "/" ? "" : pathname}`;

  const subId = searchParams.get("sub_id");
  const rulesetId = searchParams.get("ruleset_id");

  const fingerprintDashboardUrl = subId
    ? `https://dashboard-git-hackathon-personal-ruleset-flow-playground-fp-pro.vercel.app/workspaces/${encodeURIComponent(
        subId
      )}/events?latest=true`
    : "#";

  const fingerprintRulesUrl =
    subId && rulesetId
      ? `https://dashboard-git-hackathon-personal-ruleset-flow-playground-fp-pro.vercel.app/workspaces/${encodeURIComponent(
          subId
        )}/rulesets/${encodeURIComponent(rulesetId)}`
      : "#";

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
      : httpStatus === 403
      ? "badge-danger"
      : httpStatus >= 400 && httpStatus < 500
      ? "badge-warning"
      : "badge-danger";
  const isSuccessful =
    httpStatus != null && httpStatus >= 200 && httpStatus < 300;

  return (
    <div className="min-h-screen bg-st-grid flex items-center justify-center px-4">
      <main className="st-shell">
        <header className="st-header">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-1">
              <span className="st-logo">
                Secure<span className="text-[#deb887]">Hawkins</span>
              </span>
              <span className="st-logo-mark">[H]</span>
            </div>
            <span className="st-tagline">
              hawkins high school • protecting from the upside-down world
            </span>
          </div>
          <div className="st-env-pill">
            <span className="text-xs uppercase tracking-wide text-[#deb887]/80">
              User Sandbox Route
            </span>
            <span className="text-xs font-mono text-[#deb887]">
              /{prettyRoute}
            </span>
          </div>
        </header>

        {prettyRoute === "login" && (
          <section className="mb-6 border-2 border-[#deb887] bg-black px-4 py-4 text-xs sm:text-sm text-[#deb887] flex flex-col gap-2 font-mono">
            <div className="border-b border-[#deb887] pb-2 mb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono tracking-wide uppercase text-[11px] text-[#deb887]">
                  {"╔═══ HAWKINS HIGH SCHOOL PORTAL ═══╗"}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wide text-[#deb887] border border-[#deb887] px-2 py-0.5">
                  [PROTECTED]
                </span>
              </div>
            </div>
            <div className="space-y-2 text-[#deb887]">
              <p className="leading-snug">
                {">"} Welcome to SecureHawkins. This login portal protects Hawkins High School
                from threats from the Upside-Down world. Powered by{" "}
                <span className="font-mono text-[#deb887]">Fingerprint</span>{" "}
                device intelligence, you can experience fraud detection and device
                identification protecting our students and faculty.
              </p>
              <p className="leading-snug">
                {">"} If you don&apos;t have a Fingerprint account yet,{" "}
                <a
                  href="https://fingerprint.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline decoration-dotted underline-offset-2 text-[#deb887] hover:text-[#c9a068]"
                >
                  sign up at fingerprint.com
                </a>
                . Once you&apos;re in, we&apos;ll automatically provision a private
                sandbox route like this one in your dashboard, allowing you to
                configure security rules, test fraud detection, and monitor
                identification events to keep the Upside-Down at bay.
              </p>
            </div>
            <div className="border-t border-[#deb887] pt-2 mt-2 text-[10px] text-[#deb887]/60">
              {"╚═══════════════════════════════════════════════════════════════╝"}
            </div>
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
          {/* Login Card */}
          <div className="st-card">
            <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-3">
              <h1 className="text-2xl font-bold text-slate-900 font-mono tracking-wide">
                {">"} ACCESS{" "}
                <span className="text-[#deb887]">HAWKINS HIGH SCHOOL</span>
              </h1>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-mono uppercase text-slate-500">
                  [FINGERPRINT SANDBOX]
                </span>
                <span className="bg-black px-3 py-1 text-[11px] font-mono font-bold text-[#deb887] border-2 border-[#deb887] uppercase tracking-wide">
                  [ONLINE]
                </span>
              </div>
            </div>

            <div className="mb-4 space-y-1 text-xs font-mono border-2 border-black p-2 bg-black/5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-black px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#deb887] border-2 border-[#deb887]">
                  [PROTECTED ACCESS]
                </span>
                <span className="text-[11px] text-slate-700 font-semibold">
                  {">"} Upside-Down protection active.
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                {">"} STATUS: [ACTIVE] | RATING: 5.0 | DETECTION: 99.9% | BREACHES: 0
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-mono font-medium text-slate-800 uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="st-input"
                  placeholder="user@hawkinslab.gov"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-mono font-medium text-slate-800 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="st-input"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="st-button w-full"
              >
                {loading ? "[CONNECTING...]" : "[ACCESS SYSTEM]"}
              </button>

              {responseBody && (
                <div
                  className={`mt-3 px-3 py-2 text-xs border-2 font-mono ${
                    isSuccessful
                      ? "border-[#00ff00] bg-black text-[#00ff00]"
                      : "border-[#ff0000] bg-black text-[#ff0000]"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide font-bold border-2 ${
                      isSuccessful
                        ? "bg-black text-[#00ff00] border-[#00ff00]"
                        : "bg-black text-[#ff0000] border-[#ff0000]"
                    }`}>
                      [NOTICE]
                    </span>
                  </div>
                  <div
                    className={`text-[12px] sm:text-[13px] font-bold tracking-wide font-mono ${
                      isSuccessful ? "text-[#00ff00]" : "text-[#ff0000]"
                    }`}
                  >
                    {">"} {String(responseBody.message ?? "-")}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Response / Telemetry Panel */}
          <div className="st-card bg-black text-[#deb887]">
            <div className="border-b-2 border-[#deb887] mb-3 pb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold tracking-wide uppercase text-[#deb887]">
                  {"═══ FINGERPRINT SESSION INSPECTOR ═══"}
                </h2>
              <div className={`st-badge ${statusColor}`}>
                <span className="font-mono text-[11px] whitespace-nowrap">
                  {httpStatus == null ? "NO REQUEST YET" : `HTTP ${httpStatus}`}
                </span>
              </div>
              </div>
            </div>

            {errorText && (
              <div className="mb-3 border-2 border-[#deb887] bg-black px-3 py-2 text-xs text-[#deb887] font-mono">
                <div className="font-mono mb-1 text-[11px] uppercase tracking-wide">[ERROR] CLIENT ERROR</div>
                <div>{">"} {errorText}</div>
              </div>
            )}

            {!responseBody && !errorText && (
              <p className="text-xs text-[#deb887]/80 leading-relaxed font-mono">
                {">"} Submit the login form to see how{" "}
                <span className="text-[#deb887]">Fingerprint</span>–backed logic
                shapes the response. This panel always expects a JSON payload
                like:
                <br />
                <span className="font-mono text-[11px] text-[#deb887]/60">
                  {">"} {"{"} &quot;message&quot;: &quot;Login succeeded&quot;, ... {"}"}
                </span>
              </p>
            )}

            {responseBody && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#deb887]/30 pb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wide text-[#deb887]/80">
                    {">"} MESSAGE:
                  </span>
                  <span className="text-xs font-semibold text-[#deb887]">
                    {String(responseBody.message ?? "-")}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#deb887]/80 border-b border-[#deb887]/20 pb-1">
                    <span className="font-mono uppercase tracking-wide">
                      {">"} RAW JSON
                    </span>
                    <span className="font-mono text-[#deb887]/60">
                      /api{pathname === "/" ? "" : pathname}
                    </span>
                  </div>
                  <pre className="st-json">
                    {JSON.stringify(responseBody, null, 2)}
                  </pre>
                </div>

                <div className="pt-2 border-t-2 border-[#deb887] mt-2 flex flex-col gap-2">
                  <p className="text-[11px] text-[#deb887] leading-snug font-mono">
                    {isSuccessful ? (
                      <>
                        <span className="block mb-0.5 font-semibold text-[#00ff00]">
                          {">"} STATUS {httpStatus}: ALLOWED - Should this creature be welcome?
                        </span>
                      </>
                    ) : (
                      <>
                        {">"} STATUS{" "}
                        <span className="font-mono text-[#ff0000]">
                          {httpStatus}
                        </span>{" "}
                        : SUSPICIOUS/BLOCKED from Upside-Down. Open{" "}
                        <span className="text-[#deb887]">Fingerprint</span> dashboard
                        to investigate session, review events, tune rules.
                      </>
                    )}
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-1 overflow-visible">
                    <a
                      href={fingerprintDashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="st-button whitespace-nowrap px-4 py-1.5 text-[11px]"
                    >
                      [EXPLORE EVENT]
                    </a>
                    <span className="text-[10px] text-[#deb887]/60 font-mono uppercase tracking-wide">
                      {">"} THEN:
                    </span>
                    <a
                      href={fingerprintRulesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="st-button st-button-overflow whitespace-nowrap px-4 py-1.5 text-[11px] bg-transparent text-[#deb887] border-2 border-[#deb887] hover:bg-[#deb887] hover:text-black"
                    >
                      [CONFIGURE RULES & STOP DEMOGORGON]
                    </a>
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


