"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "../site.config";

/**
 * The decks — the one place on the page where the reader sees the output
 * rather than a claim about it. Figure 2 leads; the three qualitative
 * comparisons follow. Each opens to full size, the way the paper presents
 * them.
 */
export default function DecksChapter() {
  const decks = site.decks;
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewDeck = decks[previewIndex];

  const showPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    window.requestAnimationFrame(() => {
      triggerRefs.current[previewIndex]?.focus();
    });
  }, [previewIndex]);

  useEffect(() => {
    if (!previewOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 240);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [closePreview, previewOpen]);

  return (
    <section className="research-chapter decks-chapter" id="decks">
      <div className="chapter-inner">
        <p className="chapter-index">
          <span>05</span>
          <span>The decks</span>
        </p>

        <header className="chapter-head">
          <h2>One paper, four systems</h2>
          <p>The quantitative results, shown as slides rather than numbers.</p>
        </header>

        <ol className="deck-grid">
          {decks.map((deck, index) => (
            <li key={deck.preview} className={index === 0 ? "is-headline" : undefined}>
              <figure className="deck">
                <div className="deck-preview">
                  <img
                    src={deck.preview}
                    alt={`${deck.previewPage}: ${deck.title}`}
                    loading="lazy"
                  />
                  <button
                    ref={(element) => {
                      triggerRefs.current[index] = element;
                    }}
                    className="deck-enlarge"
                    type="button"
                    onClick={() => showPreview(index)}
                    aria-label={`Enlarge ${deck.previewPage}`}
                  >
                    <span aria-hidden="true">⤢</span>
                    Enlarge
                  </button>
                </div>
                <figcaption>
                  <span className="deck-role">{deck.role}</span>
                  <span className="deck-title">{deck.title}</span>
                  <span className="deck-note">{deck.note}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div
          className={`deck-lightbox${previewOpen ? " is-visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${previewDeck.previewPage}: ${previewDeck.title}`}
          aria-hidden={!previewOpen}
          onClick={closePreview}
        >
          <button
            ref={closeButtonRef}
            className="deck-lightbox-close"
            type="button"
            tabIndex={previewOpen ? 0 : -1}
            onClick={closePreview}
          >
            <span aria-hidden="true">×</span>
            Close
          </button>
          <figure
            className="deck-lightbox-stage"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={previewDeck.detail} alt={`${previewDeck.previewPage}: ${previewDeck.title}`} />
            <figcaption>
              <span>{previewDeck.role}</span>
              {previewDeck.title}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
