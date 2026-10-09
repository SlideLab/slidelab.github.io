import { preference, cost, gammaComparison } from "../site.config";

export default function HeroEvidence() {
  const timeRatio = cost.deepPresenter.seconds / cost.total.seconds;
  const costRatio = Math.floor(
    Math.min(gammaComparison.estimatedDollars, cost.deepPresenter.dollars) / cost.currentDollars,
  );
  const times = [
    { name: "SlideLab", value: cost.total.seconds, label: `${(cost.total.seconds / 60).toFixed(1)} min`, ours: true },
    { name: "DeepPresenter", value: cost.deepPresenter.seconds, label: `${cost.deepPresenter.seconds / 60} min`, ours: false },
  ];
  const prices = [
    { name: "SlideLab", value: cost.currentDollars, ours: true },
    { name: "DeepPresenter", value: cost.deepPresenter.dollars, ours: false },
    { name: "Gamma", value: gammaComparison.estimatedDollars, ours: false },
  ];
  const maxPrice = Math.max(...prices.map((price) => price.value));

  return (
    <figure className="hero-evidence" aria-label="SlideLab results and estimated cost comparisons">
      <div className="hero-evidence-grid">
        <div className="hero-metric-row">
          <h2><strong>{preference.percent}%</strong><span>win rate</span></h2>
          <div className="hero-metric-detail">
            <div className="hero-win-bar" aria-hidden="true">
              <span style={{ width: `${preference.percent}%` }} />
              <span style={{ width: `${preference.runnerUp.percent}%` }} />
            </div>
            <div className="hero-win-labels"><strong>SlideLab {preference.percent}%</strong><span>Kimi Slides {preference.runnerUp.percent}%</span></div>
            <p>Best deck on {preference.percent}% of papers in a blind study. DeepPresenter and Manus won none.</p>
          </div>
        </div>

        <div className="hero-metric-row">
          <h2><strong>{timeRatio.toFixed(1)}×</strong><span>faster</span></h2>
          <div className="hero-metric-detail">
            {times.map((time) => (
              <div className={`hero-comparison${time.ours ? " is-ours" : ""}`} key={time.name}>
                <span>{time.name}</span>
                <span className="hero-comparison-track" aria-hidden="true"><span style={{ width: `${time.value / cost.deepPresenter.seconds * 100}%` }} /></span>
                <span className="hero-comparison-value">{time.label}</span>
              </div>
            ))}
            <p>Average time to generate a full deck</p>
          </div>
        </div>

        <div className="hero-metric-row">
          <h2><strong>${cost.currentDollars.toFixed(2)}</strong><span>per deck</span></h2>
          <div className="hero-metric-detail">
            {prices.map((price) => (
              <div className={`hero-comparison${price.ours ? " is-ours" : ""}`} key={price.name}>
                <span>{price.name}</span>
                <span className="hero-comparison-track" aria-hidden="true"><span style={{ width: `${price.value / maxPrice * 100}%` }} /></span>
                <span className="hero-comparison-value">${price.value.toFixed(2)}</span>
              </div>
            ))}
            <p>{costRatio}× cheaper than DeepPresenter and Gamma<sup><a className="cost-footnote-link" href="#cost-calculation" aria-label="Read cost comparison calculation and assumptions">*</a></sup></p>
          </div>
        </div>
      </div>
      <figcaption>
        <a href="#results">See the full study <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
}
