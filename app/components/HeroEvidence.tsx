import { preference, cost, gammaComparison } from "../site.config";

export default function HeroEvidence() {
  const timeRatio = cost.deepPresenter.seconds / cost.total.seconds;
  const costRatio = Math.floor(
    Math.min(gammaComparison.estimatedDollars, cost.deepPresenter.dollars) / cost.currentDollars,
  );

  return (
    <figure className="hero-evidence" aria-label="SlideLab results and estimated cost comparisons">
      <div className="hero-evidence-grid">
        <div>
          <h2><strong>{preference.percent}%</strong> win rate</h2>
          <p>vs Kimi Slides, DeepPresenter &amp; Manus</p>
        </div>

        <div>
          <h2><strong>{timeRatio.toFixed(1)}×</strong> faster</h2>
          <p>Avg. {(cost.total.seconds / 60).toFixed(1)} vs {cost.deepPresenter.seconds / 60} min · DeepPresenter</p>
        </div>

        <div>
          <h2>
            <strong>{costRatio}×</strong> cheaper
            <sup><a className="cost-footnote-link" href="#cost-calculation" aria-label="Read cost comparison calculation and assumptions">*</a></sup>
          </h2>
          <p>${cost.currentDollars.toFixed(2)}/deck · vs Gamma &amp; DeepPresenter</p>
        </div>
      </div>
      <figcaption>
        <a href="#results">Study details <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
}
