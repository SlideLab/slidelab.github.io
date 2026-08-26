"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

const WEBAPP =
  process.env.NEXT_PUBLIC_SLIDEGEN_API ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8861" : "");
const API = WEBAPP;

const ARXIV_ID = /\d{4}\.\d{4,5}(?:v\d+)?/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Phase = "idle" | "working" | "done" | "error";

const STAGE: Record<string, string> = {
  queued: "warming up",
  downloading: "fetching the paper",
  extracting: "reading the source",
  generating: "composing the deck",
  done: "ready",
  error: "that didn't work",
};


const cleanPdf = (s: string) =>
  s.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\").replace(/\s+/g, " ").trim();

const decodeXml = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

async function readPdfTitle(file: File): Promise<string | null> {
  try {
    const text = new TextDecoder("latin1").decode(new Uint8Array(await file.arrayBuffer()));
    const xs = text.indexOf("<?xpacket");
    if (xs !== -1) {
      const xe = text.indexOf("<?xpacket end", xs);
      const xmp = text.slice(xs, xe === -1 ? undefined : xe);
      const m = xmp.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/);
      if (m && m[1].trim()) return decodeXml(m[1].trim());
    }
    const t2 = text.match(/\/Title\s*\(([^)]*)\)/);
    if (t2 && t2[1].trim()) return cleanPdf(t2[1]);
    return null;
  } catch {
    return null;
  }
}

type Job = {
  id?: string;
  title?: string | null;
  arxiv_id?: string;
  pdf_filename?: string;
  source?: string;
  status?: string;
  created_at?: string;
  view_url?: string | null;
  error?: string | null;
};

export default function DeckForge() {
  const [mode, setMode] = useState<"gen" | "mine">("gen");

  // generate
  const [email, setEmail] = useState("");
  const [val, setVal] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string | null>(null);
  const [identState, setIdentState] = useState<"idle" | "loading" | "ok">("idle");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState("queued");
  const [jobId, setJobId] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [drag, setDrag] = useState(false);
  const [shake, setShake] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // my decks
  const [mEmail, setMEmail] = useState("");
  const [mPin, setMPin] = useState("");
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [mineLoading, setMineLoading] = useState(false);
  const [mineError, setMineError] = useState<string | null>(null);

  const id = val.trim().match(ARXIV_ID)?.[0] ?? null;
  const emailOk = EMAIL_RE.test(email.trim());
  const hasPaper = !!id || !!pdf;
  const canGen = emailOk && hasPaper;
  const busy = phase === "working" || phase === "done";

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);
  useEffect(() => stop, [stop]);

  // live arXiv title — only confirms "we found it," shows no slide
  useEffect(() => {
    if (mode !== "gen" || phase !== "idle" || !id) {
      setIdentity(null);
      setIdentState("idle");
      return;
    }
    setIdentState("loading");
    const ctrl = new AbortController();
    const deb = setTimeout(() => {
      fetch(`${API}/meta/${id}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((j) => {
          setIdentity(j.title || `arXiv ${id}`);
          setIdentState("ok");
        })
        .catch(() => {
          setIdentity(`arXiv ${id}`);
          setIdentState("ok");
        });
    }, 350);
    return () => {
      clearTimeout(deb);
      ctrl.abort();
    };
  }, [id, mode, phase]);

  const poll = useCallback(
    async (jid: string) => {
      const tick = async () => {
        try {
          const r = await fetch(`${API}/status/${jid}`);
          const j = await r.json();
          setStage(j.status || "queued");
          if (j.status === "done") {
            stop();
            setPhase("done");
          } else if (j.status === "error") {
            stop();
            setPhase("error");
          }
        } catch {
          /* keep polling */
        }
      };
      await tick();
      stop();
      timer.current = setInterval(tick, 2500);
    },
    [stop]
  );

  const submit = useCallback(
    async (body: BodyInit) => {
      if (!API) {
        setPhase("error");
        setShake(true);
        return;
      }
      setPhase("working");
      setStage("queued");
      setPin(null);
      try {
        const r = await fetch(`${API}/submit`, { method: "POST", body });
        const j = await r.json();
        if (!r.ok || !j.job_id) {
          setPhase("error");
          setShake(true);
          return;
        }
        setJobId(j.job_id);
        setPin(j.pin || null);
        setEmailSent(!!j.email_sent);
        await poll(j.job_id);
      } catch {
        setPhase("error");
        setShake(true);
      }
    },
    [poll]
  );

  const generate = useCallback(() => {
    if (!emailOk || !hasPaper) {
      setShake(true);
      return;
    }
    if (pdf) {
      const fd = new FormData();
      fd.append("pdf", pdf);
      fd.append("email", email.trim());
      fd.append("skip_narration", "true");
      if (pdfTitle) fd.append("title", pdfTitle);
      submit(fd);
    } else {
      submit(
        JSON.stringify({
          arxiv_url: val.trim(),
          email: email.trim(),
          skip_narration: true,
        })
      );
    }
  }, [emailOk, hasPaper, pdf, pdfTitle, email, val, submit]);

  const onPickPdf = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setShake(true);
      return;
    }
    setPdf(file);
    setPdfTitle(null);
    readPdfTitle(file).then((t) => setPdfTitle(t || file.name.replace(/\.pdf$/i, "")));
    setVal("");
    setIdentity(null);
  }, []);

  const onFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      if (f) onPickPdf(f);
    },
    [onPickPdf]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (busy) return;
      const f = e.dataTransfer.files?.[0];
      if (f) onPickPdf(f);
    },
    [busy, onPickPdf]
  );

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 450);
    return () => clearTimeout(t);
  }, [shake]);

  const resetGen = useCallback(() => {
    stop();
    setPhase("idle");
    setStage("queued");
    setJobId(null);
    setPin(null);
    setPdf(null);
    setPdfTitle(null);
    setVal("");
  }, [stop]);

  const loadMine = useCallback(async () => {
    if (!mEmail.trim() || !mPin.trim()) return;
    setMineLoading(true);
    setMineError(null);
    try {
      const r = await fetch(`${API}/myjobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mEmail.trim(), pin: mPin.trim() }),
      });
      const j = await r.json();
      if (!r.ok) {
        setMineError(j.error || "Invalid email or PIN.");
        setJobs(null);
      } else {
        setJobs(j.jobs || []);
      }
    } catch {
      setMineError("Network error.");
      setJobs(null);
    }
    setMineLoading(false);
  }, [mEmail, mPin]);

  useEffect(() => {
    if (mode !== "mine" || !jobs?.some((j) => ["queued", "downloading", "extracting", "generating"].includes(j.status || ""))) {
      return;
    }
    const t = setInterval(loadMine, 5000);
    return () => clearInterval(t);
  }, [mode, jobs, loadMine]);

  const inProgress = phase === "working" || phase === "done" || phase === "error";

  return (
    <div
      id="demo"
      className={`deck-forge${drag ? " is-drag" : ""}${shake ? " is-shake" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!busy && mode === "gen") setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={mode === "gen" ? onDrop : undefined}
    >
      <div className="df-topline">
        <div className="df-tabs" role="tablist">
          <button className={`df-tab${mode === "gen" ? " is-active" : ""}`} role="tab" onClick={() => setMode("gen")}>
            Generate
          </button>
          <button className={`df-tab${mode === "mine" ? " is-active" : ""}`} role="tab" onClick={() => setMode("mine")}>
            My decks
          </button>
        </div>
        <span className="df-runtime">~10 min</span>
      </div>

      {mode === "gen" ? (
        inProgress ? (
          <>
            <h2 className="df-q">Forging your deck.</h2>
            {phase === "working" && (
              <div className="df-result">
                <span className="df-status">{STAGE[stage] ?? "working"}</span>
                <p className="df-aside">
                  We&rsquo;ll email <b>{email}</b> when it&rsquo;s ready. You can close this tab and return through &ldquo;My decks&rdquo;.
                </p>
                {pin && (
                  <div className="df-recovery" aria-live="polite">
                    <span className="df-recovery-label">Your recovery PIN</span>
                    <strong className="df-recovery-code">{pin}</strong>
                    <span className="df-recovery-note">
                      {emailSent
                        ? "We also sent this PIN to your email."
                        : "Email delivery is unavailable, so save this PIN now."}
                    </span>
                  </div>
                )}
              </div>
            )}
            {phase === "done" && jobId && (
              <div className="df-result">
                <p className="df-ok">Your deck is ready{emailSent ? " — check your email" : ""}.</p>
                <a className="df-open" href={`${WEBAPP}/view/${jobId}/`} target="_blank" rel="noreferrer">
                  Open the deck <span aria-hidden="true">↗</span>
                </a>
                {pin && (
                  <div className="df-recovery" aria-live="polite">
                    <span className="df-recovery-label">Recovery PIN</span>
                    <strong className="df-recovery-code">{pin}</strong>
                    <span className="df-recovery-note">Use it with {email} under &ldquo;My decks&rdquo;.</span>
                  </div>
                )}
                <button className="df-link" type="button" onClick={resetGen}>
                  forge another
                </button>
              </div>
            )}
            {phase === "error" && (
              <div className="df-result">
                <p className="df-err">
                  {API ? "That didn’t generate. Try again." : "The public demo API has not been configured."}
                </p>
                <button className="df-link" type="button" onClick={resetGen}>
                  retry
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="df-intro">
              <p className="df-q">Your paper. <em>As a deck.</em></p>
            </div>

            <div className={`df-source-picker${hasPaper ? " has-paper" : ""}`}>
              <div className={`df-field${shake ? " is-error" : ""}`}>
                <label className="df-sr-only" htmlFor="df-paper">arXiv URL or ID</label>
                {pdf ? (
                  <div className="df-pdfchoice">
                    <span className="df-pdfname">{pdfTitle || pdf.name}</span>
                    <button className="df-link" type="button" onClick={() => { setPdf(null); setPdfTitle(null); }}>
                      remove
                    </button>
                  </div>
                ) : (
                  <input
                    id="df-paper"
                    className="df-input"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && hasPaper) {
                        (document.getElementById("df-email") as HTMLInputElement)?.focus();
                      }
                    }}
                    placeholder="Paste an arXiv link"
                    spellCheck={false}
                    autoComplete="off"
                  />
                )}
                {identity && !pdf && (
                  <p className="df-meta">
                    <span className="df-arrow" aria-hidden="true">→</span>
                    <b>{identState === "loading" ? "found it —" : identity}</b>
                  </p>
                )}
              </div>
              {!hasPaper && (
                <>
                  <span className="df-choice-word">or</span>
                  <button className="df-pdfbtn" type="button" onClick={() => fileRef.current?.click()}>
                    Upload a PDF <span aria-hidden="true">↥</span>
                  </button>
                </>
              )}
            </div>

            {hasPaper && (
              <div className="df-reveal">
                <p className="df-delivery-prompt">Send the finished deck to</p>
                <label className="df-sr-only" htmlFor="df-email">Delivery email</label>
                <input
                  id="df-email"
                  className="df-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") generate(); }}
                  placeholder="name@institution.edu"
                  spellCheck={false}
                  autoComplete="email"
                />
                <p className="df-payoff">~14 slides · ready in about 10 minutes</p>
              </div>
            )}

            {hasPaper && (
              <div className="df-actions">
                <button className="df-go" type="button" onClick={generate} disabled={!canGen}>
                  Generate my deck <span className="df-go-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </>
        )
      ) : (
        <>
          <h2 className="df-q">Your decks.</h2>
          <p className="df-sub">Use the email and PIN from your start email.</p>

          <div className="df-field">
            <label className="df-label" htmlFor="df-account-email">Email</label>
            <input
              id="df-account-email"
              className="df-email"
              type="email"
              value={mEmail}
              onChange={(e) => setMEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") loadMine(); }}
              placeholder="email"
              spellCheck={false}
              autoComplete="email"
            />
          </div>
          <div className="df-field">
            <label className="df-label" htmlFor="df-account-pin">Recovery PIN</label>
            <input
              id="df-account-pin"
              className="df-pin-input"
              value={mPin}
              onChange={(e) => setMPin(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") loadMine(); }}
              placeholder="PIN"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <div className="df-actions">
            <button className="df-go" type="button" onClick={loadMine} disabled={!mEmail.trim() || !mPin.trim() || mineLoading}>
              {mineLoading ? "Checking…" : "Show my decks"}
            </button>
          </div>

          {mineError && <p className="df-err">{mineError}</p>}
          {jobs && (jobs.length ? (
            <ul className="df-jobs">
              {jobs.map((j) => (
                <li key={j.id} className="df-job">
                  <div className="df-job-main">
                    <span className="df-job-title">{j.title || (j.source === "pdf" ? j.pdf_filename : `arXiv:${j.arxiv_id}`) || "Untitled"}</span>
                    <span className="df-job-meta">{j.created_at ? new Date(j.created_at).toLocaleString() : ""}</span>
                  </div>
                  <span className={`df-badge df-badge--${j.status}`}>{j.status}</span>
                  {j.view_url ? (
                    <a className="df-open" href={j.view_url} target="_blank" rel="noreferrer">open <span aria-hidden="true">↗</span></a>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="df-aside">No decks found for this email yet.</p>
          ))}
        </>
      )}

      <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={onFile} />
    </div>
  );
}
