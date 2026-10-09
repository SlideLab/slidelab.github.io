import { site, coralBricksTiming } from "../site.config";
import AuthorPreviews from "./AuthorPreviews";
import DeckForge from "./DeckForge";
import HeroEvidence from "./HeroEvidence";

export default function Hero() {
  return (
    <>
    <header className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-brand-row" aria-label="INSAIT and CoralBricks">
          <a className="hero-insait-logo" href="https://insait.ai/" target="_blank" rel="noreferrer">
            <img src="/img/insait-logo.webp" alt="INSAIT — Institute for Computer Science, Artificial Intelligence and Technology" width="540" height="291" decoding="async" />
          </a>
          <a className="hero-coralbricks-logo" href={coralBricksTiming.url} target="_blank" rel="noreferrer">
            <img src="https://www.coralbricks.ai/logo-icon.svg" alt="" width="34" height="37" aria-hidden="true" />
            <span>CoralBricks</span>
          </a>
        </div>
        <h1 className="hero-title">{site.title}</h1>
        <AuthorPreviews authors={site.authors} />

        <p className="hero-lead">
          We present SlideLab, a training-free multi-agent framework that generates
          scientific presentations from research papers, and ConfArena, an evaluation
          environment that assesses a deck the way an audience does.
        </p>

        <div className="hero-links" aria-label="Project links">
          <a className="primary-link" href={site.links.paper}>
            Read the paper <span aria-hidden="true">&#8599;</span>
          </a>
          <a className="primary-link annotation-cta" href={site.links.annotation} target="_blank" rel="noreferrer">
            Rate decks <span aria-hidden="true">&#8599;</span>
          </a>
          {site.links.code ? (
            <a className="primary-link" href={site.links.code} target="_blank" rel="noreferrer">
              GitHub / Code <span aria-hidden="true">&#8599;</span>
            </a>
          ) : (
            <span>Code &middot; {site.release.code}</span>
          )}
        </div>
      </div>

      <HeroEvidence />
    </header>
    <section className="demo-section" aria-labelledby="demo-section-title">
      <div className="demo-section-inner">
        <div className="demo-copy">
          <a className="demo-powered-by" href={coralBricksTiming.url} target="_blank" rel="noreferrer">
            <img src="https://www.coralbricks.ai/logo-icon.svg" alt="" width="30" height="33" loading="lazy" />
            <span><span className="demo-provider-label">Powered by</span><strong>CoralBricks <span aria-hidden="true">↗</span></strong></span>
          </a>
          <h2 id="demo-section-title">Try it on your own paper</h2>
          <p>Paste an arXiv link or upload a PDF. Get a checked, ready-to-present deck by email, usually in about {coralBricksTiming.seconds / 60} minutes with CoralBricks.</p>
        </div>
        <DeckForge />
      </div>
    </section>
    </>
  );
}
