import { site, cost, gammaComparison } from "../site.config";

/**
 * Colophon — how to cite the work, what is released, and where the
 * numbers on this page came from.
 */
export default function Colophon() {
  return (
    <footer className="colophon" id="citation">
      <div className="colophon-inner">
        <div className="colophon-grid">
          <div>
            <p className="eyebrow">{site.name}</p>
            <h2>Citation</h2>
            <pre className="bibtex">
{`@inproceedings{slidelab2026,
  title     = {${site.title}},
  author    = {${site.authors.map((author) => author.name).join(" and ")}},
  year      = {2026}
}`}
            </pre>
            <p className="colophon-note">
              Research results come from the manuscript and appendix. Current cost
              comparisons are explained below.
            </p>
          </div>

          <div className="colophon-facts">
            <div className="colophon-fact">
              <span className="label">Paper</span>
              <p>
                <a href={site.links.paper}>arXiv paper</a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Code</span>
              <p>
                <a href={site.links.code} target="_blank" rel="noreferrer">
                  GitHub / Code
                </a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Human evaluation</span>
              <p>
                <a href={site.links.annotation} target="_blank" rel="noreferrer">
                  Rate decks
                </a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Authors</span>
              <p>
                {site.authors.map((author, index) => (
                  <span key={author.name}>
                    {index > 0 && ", "}
                    <a href={author.url}>{author.name}</a>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <aside className="cost-calculation" id="cost-calculation" tabIndex={-1} aria-label="Cost comparison calculation">
          <p>
            * Gamma estimate: (20 <a href="https://developers.gamma.app/get-started/access-and-pricing">slides × 3 credits, upper rate</a> + 6 <a href="https://developers.gamma.app/reference/image-model-accepted-values">GPT Image 2 images × 20 credits</a>) × (<a href="https://omidsaffari.com/blog/gamma-pricing">$12 / 1,000 credits · Plus monthly</a>) = ${gammaComparison.estimatedDollars.toFixed(2)}/deck.
          </p>
          <p>
            Full credit use; excludes Gamma tax/retries. Gamma ${gammaComparison.estimatedDollars.toFixed(2)} ÷ SlideLab ${cost.currentDollars.toFixed(2)} = {(gammaComparison.estimatedDollars / cost.currentDollars).toFixed(2)}×; <a href={site.links.paper}>DeepPresenter ${cost.deepPresenter.dollars.toFixed(2)}</a> ÷ ${cost.currentDollars.toFixed(2)} = {(cost.deepPresenter.dollars / cost.currentDollars).toFixed(2)}×. Both rounded down to 4×.
          </p>
        </aside>
      </div>
    </footer>
  );
}
