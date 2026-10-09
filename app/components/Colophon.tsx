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
{`@misc{vats2026slidelabaudiencecenteredscientificslide,
  title={SlideLab: Audience-Centered Scientific Slide Generation and Evaluation},
  author={Vidushee Vats and Karun Sharma and Yuxia Wang},
  year={2026},
  eprint={2609.30294},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2609.30294},
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
            <strong>* Gamma estimate</strong> (20 slides, 6 GPT Image 2 images): <span className="cost-equation">(20×3 + 6×20) × $12/1,000 = ${gammaComparison.estimatedDollars.toFixed(2)}/deck.</span>
          </p>
          <p>
            <strong>DeepPresenter:</strong> <a href={site.links.paper}>${cost.deepPresenter.dollars.toFixed(2)}/deck</a>. Both ≈4× SlideLab’s ${cost.currentDollars.toFixed(2)}.
          </p>
          <details>
            <summary>Assumptions &amp; sources</summary>
            <p>
              <a href="https://omidsaffari.com/blog/gamma-pricing">Plus monthly: $12 / 1,000 credits</a>; <a href="https://developers.gamma.app/get-started/access-and-pricing">3 credits/slide (upper rate)</a>; <a href="https://developers.gamma.app/reference/image-model-accepted-values">20 credits/GPT Image 2 image</a>. Ratios rounded down.
            </p>
          </details>
        </aside>
      </div>
    </footer>
  );
}
