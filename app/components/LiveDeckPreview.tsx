"use client";

import { useEffect, useRef, useState } from "react";

export type DeckProgress = {
  status: string; phase: string; label: string; activity: string;
  planned_titles: string[]; built: number; total: number; revision: string;
  css: string; slides: { title: string; html: string; complete: boolean }[];
};

function SlideCanvas({ html, css, api, title }: { html: string; css: string; api: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(.3);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setScale(node.clientWidth / 1280));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const origin = new URL(api, typeof window === "undefined" ? "https://slidelab.github.io" : window.location.href).origin;
  const doc = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src ${origin}/preview-assets/ data:; font-src 'none'; base-uri 'none'; form-action 'none'"><style>${css.replace(/<\/style/gi, "<\\/style")}
html,body{margin:0!important;padding:0!important;width:1280px!important;height:720px!important;overflow:hidden!important}*{box-sizing:border-box}.deck,.slides{margin:0!important;padding:0!important;transform:none!important}.slides>section{width:1280px!important;height:720px!important;overflow:hidden!important;visibility:visible!important;opacity:1!important}.live-visual-pending{min-height:100px;border:1px dashed #bbb;display:flex;align-items:center;justify-content:center;font:18px sans-serif;color:#555}</style></head><body><div class="deck"><div class="slides">${html}</div></div></body></html>`;
  return <div className="df-live-canvas" ref={host}>
    <iframe title={title} sandbox="" srcDoc={doc} tabIndex={-1} style={{ transform: `scale(${scale})` }} />
  </div>;
}

export default function LiveDeckPreview({ progress, api }: { progress: DeckProgress; api: string }) {
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const [fresh, setFresh] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const previous = useRef("");
  const total = progress.total;
  const selected = Math.min(index, Math.max(total - 1, 0));
  const slide = progress.slides[selected];
  useEffect(() => {
    if (follow && progress.slides.length) setIndex(progress.slides.length - 1);
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
  const content = (large = false) => <>
    <div className={`df-live-screen${fresh ? " is-updated" : ""}`}>
      {slide ? <SlideCanvas html={slide.html} css={progress.css} api={api} title={`Draft slide ${selected + 1}: ${slide.title}`} /> :
        <div className="df-live-wait"><span>{total ? `Slide ${selected + 1} · planned` : "Reading your paper"}</span>
          <p>{progress.planned_titles[selected] || "The agents are selecting the story and evidence."}</p>
          <small>{total ? "This slide will appear as it is written." : "The slide plan appears here first, then the actual deck."}</small></div>}
      {fresh && slide && progress.status !== "done" && <span className="df-live-cursor" aria-hidden="true"><svg viewBox="0 0 20 24"><path d="M2 2v17l5-4 4 7 3-2-4-7 6-1Z" fill="currentColor" stroke="white" strokeWidth="1.5" /></svg><span>{progress.phase === "building" ? "Writing" : "Updating"}</span></span>}
    </div>
    <div className="df-live-bottom"><span>{total ? `Slide ${selected + 1} / ${total}` : "Plan in progress"}</span>
      <div><button type="button" aria-label="Previous slide" disabled={selected === 0} onClick={() => choose(selected - 1)}>←</button>
      <button type="button" aria-label="Next slide" disabled={selected >= total - 1} onClick={() => choose(selected + 1)}>→</button>
      {!large && <button type="button" onClick={() => dialog.current?.showModal()}>Expand ↗</button>}</div></div>
  </>;
  return <div className="df-live">
    <ol className="df-live-stages" aria-label="Generation stages">
      {["Plan", "Build", "Visuals", "Review"].map((name, n) => {
        const current = ["planning", "building", "visuals", "review"].indexOf(progress.phase);
        return <li key={name} className={progress.phase === "ready" || n < current ? "is-complete" : n === current ? "is-current" : ""} aria-current={n === current ? "step" : undefined}>{name}</li>;
      })}
    </ol>
    <div className="df-live-top"><span><i className={progress.status === "done" ? "" : "is-live"} />{progress.status === "done" ? "Finished deck" : "Live draft"}</span>
      <span>{progress.built}{total ? ` / ${total}` : ""} slides built</span></div>
    {content()}
    {total > 0 && <div className="df-live-filmstrip" ref={nav} aria-label="Slides">
      {Array.from({ length: total }, (_, n) => <button key={n} type="button" data-index={n} aria-current={n === selected ? "true" : undefined}
        className={`${n === selected ? "is-selected" : ""} ${progress.slides[n] ? "is-built" : ""}`}
        title={progress.slides[n]?.title || progress.planned_titles[n] || `Slide ${n + 1}`} aria-label={`Slide ${n + 1}${progress.slides[n] ? "" : ", planned"}`} onClick={() => choose(n)}>{n + 1}</button>)}
    </div>}
    <div className="df-live-activity"><span role="status">{progress.activity}</span>
      <label><input type="checkbox" checked={follow} onChange={e => setFollow(e.target.checked)} />Follow build</label></div>
    <p className="df-live-note">{progress.status === "done" ? "Open the finished deck below for full resolution." : "Actual generated slides. Layout and visuals may still change."}</p>
    <dialog className="df-live-dialog" ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current?.close(); }}>
      <div className="df-live-dialog-head"><span>Deck preview · {progress.label}</span><button type="button" onClick={() => dialog.current?.close()}>Close ✕</button></div>
      {content(true)}
    </dialog>
  </div>;
}
