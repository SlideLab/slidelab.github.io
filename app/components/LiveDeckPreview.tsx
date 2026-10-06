"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type DeckProgress = {
  status: string; phase: string; label: string; activity: string;
  planned_titles: string[]; built: number; total: number; revision: string;
  css: string; slides: { title: string; html: string; complete: boolean }[];
};

function SlideCanvas({ html, css, api, title, writing }: { html: string; css: string; api: string; title: string; writing: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const previousHtml = useRef("");
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const node = host.current;
    if (!node) return;
    const measure = () => { if (node.clientWidth > 0) setScale(node.clientWidth / 1280); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const observedHtml = useMemo(() => {
    if (!writing || !previousHtml.current || typeof DOMParser === "undefined") return html;
    const parser = new DOMParser();
    const before = parser.parseFromString(previousHtml.current, "text/html");
    const after = parser.parseFromString(html, "text/html");
    const selector = "h1,h2,h3,p,li,td,figcaption,img";
    const old = Array.from(before.querySelectorAll(selector));
    const changed = Array.from(after.querySelectorAll(selector)).filter((node, n) =>
      node.textContent !== old[n]?.textContent || node.getAttribute("src") !== old[n]?.getAttribute("src"));
    changed.forEach(node => node.setAttribute("data-live-change", "true"));
    changed.filter(node => node.tagName !== "IMG").at(-1)?.setAttribute("data-live-writing", "true");
    return after.body.innerHTML;
  }, [html, writing]);
  useEffect(() => { previousHtml.current = html; }, [html]);
  const origin = new URL(api, typeof window === "undefined" ? "https://slidelab.github.io" : window.location.href).origin;
  const doc = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src ${origin}/preview-assets/ data:; font-src 'none'; base-uri 'none'; form-action 'none'"><style>${css.replace(/<\/style/gi, "<\\/style")}
html,body{margin:0!important;padding:0!important;width:1280px!important;height:720px!important;overflow:hidden!important}body{zoom:${scale}}*{box-sizing:border-box}.deck,.slides{margin:0!important;padding:0!important;transform:none!important}.slides>section{width:1280px!important;height:720px!important;overflow:hidden!important;visibility:visible!important;opacity:1!important}.live-visual-pending{min-height:100px;border:1px dashed #bbb;display:flex;align-items:center;justify-content:center;font:18px sans-serif;color:#555}[data-live-change]{animation:live-change .8s ease-out}[data-live-writing]::after{content:"";display:inline-block;width:2px;height:1em;background:currentColor;margin-left:3px;vertical-align:text-bottom;animation:live-caret .7s step-end 3 forwards}@keyframes live-change{from{outline:2px solid #705bff}to{outline-color:transparent}}@keyframes live-caret{50%,100%{opacity:0}}@media(prefers-reduced-motion:reduce){[data-live-change]{animation:none}[data-live-writing]::after{display:none}}</style></head><body><div class="deck"><div class="slides">${observedHtml}</div></div></body></html>`;
  return <div className="df-live-canvas" ref={host}>
    {scale !== null && <iframe key={doc} title={title} sandbox="" srcDoc={doc} tabIndex={-1} />}
  </div>;
}

export default function LiveDeckPreview({ progress, api }: { progress: DeckProgress; api: string }) {
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const [fresh, setFresh] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const nav = useRef<HTMLDivElement>(null);
  const previous = useRef("");
  const total = progress.total;
  const hasContent = (s: DeckProgress["slides"][number]) => s.title.trim() || /<(img|p|li|table)\b/i.test(s.html);
  let latest = 0;
  for (let n = progress.slides.length - 1; n >= 0; n--) {
    if (hasContent(progress.slides[n])) { latest = n; break; }
  }
  const selected = Math.min(follow ? latest : index, Math.max(total - 1, 0));
  const candidate = progress.slides[selected];
  const slide = candidate && hasContent(candidate) ? candidate : undefined;
  useEffect(() => {
    if (previous.current && previous.current !== progress.revision && progress.slides.length) {
      setFresh(true);
      const timeout = setTimeout(() => setFresh(false), 1100);
      previous.current = progress.revision;
      return () => clearTimeout(timeout);
    }
    setFresh(false);
    previous.current = progress.revision;
  }, [progress.revision, progress.slides.length, follow]);
  useEffect(() => {
    const strip = nav.current;
    const button = strip?.querySelector<HTMLElement>(`[data-index="${selected}"]`);
    if (strip && button) {
      const delta = button.getBoundingClientRect().left - strip.getBoundingClientRect().left;
      if (delta < 0 || delta + button.offsetWidth > strip.clientWidth) strip.scrollLeft += delta - strip.clientWidth / 2;
    }
  }, [selected]);
  const choose = (n: number) => { setFollow(false); setIndex(n); };
  const waiting = progress.status === "downloading"
    ? ["Fetching the paper", "Downloading the paper PDF.", "The slide plan will appear after the paper is read."]
    : progress.status === "queued"
    ? ["Waiting to start", "Your paper is in the queue.", "Generation has not started yet."]
    : progress.phase === "source"
    ? ["Reading the paper", "Extracting the paper’s text and figures.", "Planning starts once the source is ready."]
    : progress.phase === "error"
    ? ["Generation stopped", progress.label, "No new slides are being generated."]
    : [progress.label || "Planning the story", "Selecting the story and supporting figures.", "The slide plan appears first, then the actual deck."];
  const content = (large = false) => <>
    <div className={`df-live-screen${fresh ? " is-updated" : ""}`}>
      {slide ? <SlideCanvas html={slide.html} css={progress.css} api={api} title={`Draft slide ${selected + 1}: ${slide.title}`} writing={progress.phase === "building" && !slide.complete} /> :
        <div className="df-live-wait"><span>{total ? `Slide ${selected + 1} · planned` : waiting[0]}</span>
          <p>{progress.planned_titles[selected] || waiting[1]}</p>
          <small>{total ? "This slide will appear as it is written." : waiting[2]}</small></div>}
    </div>
    <div className="df-live-bottom"><span>{total ? `Slide ${selected + 1} / ${total}` : progress.label}</span>
      <div><button type="button" aria-label="Previous slide" disabled={selected === 0} onClick={() => choose(selected - 1)}>←</button>
      <button type="button" aria-label="Next slide" disabled={selected >= total - 1} onClick={() => choose(selected + 1)}>→</button>
      {!large && <button type="button" onClick={() => { setExpanded(true); dialog.current?.showModal(); }}>Expand ↗</button>}</div></div>
  </>;
  return <div className="df-live">
    <ol className="df-live-stages" aria-label="Generation stages">
      {["Source", "Plan", "Build", "Visuals", "Review"].map((name, n) => {
        const current = ["source", "planning", "building", "visuals", "review"].indexOf(progress.phase);
        return <li key={name} className={progress.phase === "ready" || n < current ? "is-complete" : n === current ? "is-current" : ""} aria-current={n === current ? "step" : undefined}>{name}</li>;
      })}
    </ol>
    <div className="df-live-top"><span><i className={progress.status === "done" ? "" : "is-live"} />{progress.status === "done" ? "Finished deck" : progress.phase === "source" || progress.status === "queued" ? "Preparing source" : "Live draft"}</span>
      <span>{total ? `${progress.built} / ${total} slides built` : ""}</span></div>
    {content()}
    {total > 0 && <div className="df-live-filmstrip" ref={nav} aria-label="Slides">
      {Array.from({ length: total }, (_, n) => <button key={n} type="button" data-index={n} aria-current={n === selected ? "true" : undefined}
        className={`${n === selected ? "is-selected" : ""} ${progress.slides[n] ? "is-built" : ""}`}
        title={progress.slides[n]?.title || progress.planned_titles[n] || `Slide ${n + 1}`} aria-label={`Slide ${n + 1}${progress.slides[n] ? "" : ", planned"}`} onClick={() => choose(n)}>{n + 1}</button>)}
    </div>}
    <div className="df-live-activity"><span role="status">{progress.activity}</span>
      <label><input type="checkbox" checked={follow} onChange={e => setFollow(e.target.checked)} />Follow build</label></div>
    <p className="df-live-note">{progress.status === "done" ? "Open the finished deck below for full resolution." : "Actual generated slides. Layout and visuals may still change."}</p>
    <dialog className="df-live-dialog" ref={dialog} onClose={() => setExpanded(false)} onClick={e => { if (e.target === dialog.current) dialog.current?.close(); }}>
      <div className="df-live-dialog-head"><span>Deck preview · {progress.label}</span><button type="button" onClick={() => dialog.current?.close()}>Close ✕</button></div>
      {expanded && content(true)}
    </dialog>
  </div>;
}
