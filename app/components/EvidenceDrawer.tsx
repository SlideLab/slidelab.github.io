"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Tab = { label: string; content: ReactNode };

/**
 * EvidenceDrawer — the deeper material a section rests on: full tables,
 * configuration, per-metric detail. Closed by default, because the section
 * itself should already carry the claim.
 */
export default function EvidenceDrawer({
  title,
  actionLabel,
  children,
  tabs,
}: {
  title: string;
  actionLabel: string;
  children?: ReactNode;
  tabs?: Tab[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  return (
    <>
      <button className="evidence-trigger" type="button" onClick={show}>
        <span>{actionLabel}</span>
        <span aria-hidden="true">→</span>
      </button>

      <dialog className="evidence-dialog" ref={dialogRef} onClose={() => setOpen(false)}>
        <div className="evidence-sheet">
          <header className="evidence-head">
            <div>
              <p className="eyebrow">Supporting evidence</p>
              <h2>{title}</h2>
            </div>
            <button className="evidence-close" type="button" onClick={close} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          {tabs && tabs.length > 1 && (
            <div className="evidence-tabs" role="tablist">
              {tabs.map((tab, index) => (
                <button
                  key={tab.label}
                  role="tab"
                  type="button"
                  aria-selected={index === active}
                  onClick={() => setActive(index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="evidence-content">{tabs ? tabs[active]?.content : children}</div>
        </div>
      </dialog>
    </>
  );
}
