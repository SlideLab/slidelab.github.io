import { preference, cost } from "../site.config";

function ComparisonRow({ name, value, share, ours = false }: {
  name: string; value: string; share: number; ours?: boolean;
}) {
  return (
    <div className={`hero-evidence-row${ours ? " is-ours" : ""}`}>
      <span className="hero-evidence-system">{name}</span>
      <span className="hero-evidence-track" aria-hidden="true">
        <span style={{ width: `${share}%` }} />
      </span>
      <span className="hero-evidence-measure">{value}</span>
    </div>
  );
}

export default function HeroEvidence() {
  const timeRatio = cost.deepPresenter.seconds / cost.total.seconds;
  const costReduction = Math.round((1 - cost.total.dollars / cost.deepPresenter.dollars) * 100);

  return (
    <figure className="hero-evidence" aria-label="SlideLab benchmark comparisons">
      <div className="hero-evidence-grid">
        <div className="hero-evidence-study">
          <h2>Human preference</h2>
          <p className="hero-evidence-headline">
            <strong>{preference.percent}%</strong> picked SlideLab
          </p>
          <div className="hero-preference-bar" aria-hidden="true">
            <span style={{ width: `${preference.ours / preference.total * 100}%` }} />
          </div>
          <div className="hero-preference-legend">
            <span><i aria-hidden="true" />SlideLab <b>{preference.percent}%</b></span>
            <span><i aria-hidden="true" />Kimi Slides <b>{preference.runnerUp.percent}%</b></span>
          </div>
          <p className="hero-evidence-note">DeepPresenter &amp; Manus: 0 papers picked best.</p>
          <p className="hero-evidence-scope">Blind four-way choice · {preference.ours}/{preference.total} papers won</p>
        </div>

        <div className="hero-evidence-comparison">
          <h2>Generation time</h2>
          <p className="hero-evidence-headline"><strong>{timeRatio.toFixed(1)}×</strong> faster</p>
          <ComparisonRow name="SlideLab" value={`${(cost.total.seconds / 60).toFixed(1)} min`}
            share={100 / timeRatio} ours />
          <ComparisonRow name="DeepPresenter" value={`${cost.deepPresenter.seconds / 60} min`} share={100} />
          <p className="hero-evidence-scope">Average end-to-end time per deck</p>
        </div>

        <div className="hero-evidence-comparison">
          <h2>API cost</h2>
          <p className="hero-evidence-headline"><strong>{costReduction}%</strong> lower cost</p>
          <ComparisonRow name="SlideLab" value={`$${cost.total.dollars.toFixed(2)}`}
            share={cost.total.dollars / cost.deepPresenter.dollars * 100} ours />
          <ComparisonRow name="DeepPresenter" value={`$${cost.deepPresenter.dollars.toFixed(2)}`} share={100} />
          <p className="hero-evidence-scope">Average API cost per deck</p>
        </div>
      </div>
      <figcaption>
        Reported in our paper: preference on 30 papers; time and cost on 100 papers.
        <a href="#results">Study results <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
}
