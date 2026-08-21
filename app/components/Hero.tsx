import { site } from "../site.config";
import AuthorPreviews from "./AuthorPreviews";
import PreferenceArtifact from "./figures/PreferenceArtifact";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-copy">
        <h1 className="hero-title">{site.title}</h1>
        <AuthorPreviews authors={site.authors} />

        {/* The framing, taken from the opening of the paper. */}
        <p className="hero-question">
          A conference talk gives an author 10 to 15 minutes to communicate what a paper
          develops over eight pages.
        </p>
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
        </div>
      </div>

      <PreferenceArtifact />
    </header>
  );
}
