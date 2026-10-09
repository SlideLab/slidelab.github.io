import { preference, cost } from "../site.config";

export default function HeroEvidence() {
  const timeRatio = cost.deepPresenter.seconds / cost.total.seconds;
  const costReduction = Math.round((1 - cost.currentDollars / cost.deepPresenter.dollars) * 100);

  return (
    <figure className="hero-evidence" aria-label="SlideLab benchmark comparisons">
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
          <h2><strong>{costReduction}%</strong> lower cost</h2>
          <p>Avg. ${cost.currentDollars.toFixed(2)} vs ${cost.deepPresenter.dollars.toFixed(2)} · DeepPresenter</p>
        </div>
      </div>
      <figcaption>
        <a href="#results">Study details <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
}
