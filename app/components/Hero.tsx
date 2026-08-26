import { site } from "../site.config";
import AuthorPreviews from "./AuthorPreviews";
import DeckForge from "./DeckForge";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-copy">
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
          {site.links.code ? (
            <a href={site.links.code}>Code</a>
          ) : (
            <span>Code &middot; {site.release.code}</span>
          )}
          <a href={site.links.annotation} target="_blank" rel="noreferrer">
            Blind annotation <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>

      <DeckForge />
    </header>
  );
}
