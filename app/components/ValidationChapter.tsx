import EvidenceDrawer from "./EvidenceDrawer";
import { ranks, perturbations, sensitivity } from "../site.config";

const MARK: Record<string, { glyph: string; className: string; label: string }> = {
  yes: { glyph: "✓", className: "mark-yes", label: "detected" },
  no: { glyph: "×", className: "mark-no", label: "not detected" },
  none: { glyph: "○", className: "mark-none", label: "no metric for this failure" },
};

export default function ValidationChapter() {
  return (
    <section className="research-chapter validation-chapter" id="validation">
      <div className="chapter-inner">
        <p className="chapter-index">
          <span>04</span>
          <span>Validating ConfArena</span>
        </p>

        <header className="chapter-head">
          <h2>An evaluation is only useful if it catches what it claims to</h2>
          <p>
            The previous section used ConfArena to evaluate SlideLab. This one tests
            ConfArena itself: whether it agrees with human judgment, and whether each of
            its measures responds to the failure it was designed to catch.
          </p>
        </header>

        <div className="validation-split">
          {/* Left: does the ranking match the humans? */}
          <figure className="rank-figure">
            <h3 className="validation-heading">Does it agree with people?</h3>
            <p className="validation-body">
              System rank under each framework, against the blind human study. ConfArena
              is the only automated evaluation that reproduces the human ordering.
              PresentBench places Kimi Slides above SlideLab.
            </p>

            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>System</th>
                    {ranks.frameworks.map((framework) => (
                      <th key={framework}>{framework}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ranks.rows.map((row) => (
                    <tr key={row.system} className={"ours" in row && row.ours ? "ours" : ""}>
                      <td>{row.system}</td>
                      {row.ranks.map((rank, index) => (
                        <td key={ranks.frameworks[index]} className={`num ${rank === 1 ? "best" : ""}`}>
                          {rank}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figcaption className="tbl-note">
              <strong>Table 5.</strong> Rank under four evaluation frameworks, 1 is best.
              Manus and DeepPresenter tie in the human study, with zero best-picks each.
              PPTEval ranks use the mean of its three dimensions.
            </figcaption>
          </figure>

          {/* Right: does it catch planted damage? */}
          <figure className="perturb-figure">
            <h3 className="validation-heading">Does it catch planted damage?</h3>
            <p className="validation-body">
              Fifteen high-quality decks were damaged in four targeted ways, each
              affecting a single aspect, then re-scored. ConfArena is the only framework
              that catches all four on the axis meant to detect them.
            </p>

            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Damage applied</th>
                    {perturbations.frameworks.map((framework) => (
                      <th key={framework}>{framework}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {perturbations.rows.map((row) => (
                    <tr key={row.damage}>
                      <td>{row.damage}</td>
                      {row.verdicts.map((verdict, index) => {
                        const mark = MARK[verdict];
                        return (
                          <td key={perturbations.frameworks[index]}>
                            <span className={mark.className} title={mark.label}>
                              {mark.glyph}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="rule-above">
                    <td>
                      <em>Caught out of 4</em>
                    </td>
                    {perturbations.caught.map((count, index) => (
                      <td
                        key={perturbations.frameworks[index]}
                        className={`num ${count === 4 ? "best" : ""}`}
                      >
                        <em>{count}</em>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <figcaption className="tbl-note">
              <strong>Table 6.</strong> ✓ the framework&rsquo;s relevant metric moved in
              the expected direction &middot; × it did not &middot; ○ the framework has no
              metric targeting that failure, so detection is impossible by design.
            </figcaption>
          </figure>
        </div>

        <div className="system-actions">
          <EvidenceDrawer
            title="Each damage moves mainly its own metric"
            actionLabel="Per-metric sensitivity"
            tabs={[
              {
                label: "Sensitivity",
                content: (
                  <>
                    <p className="drawer-intro">
                      A useful metric should respond to the failure it measures while
                      staying relatively insensitive to unrelated changes. Shuffling slide
                      order raises narrative defects without touching grounding; injecting
                      one false number raises grounding errors; shrinking figures affects
                      figure readability; dropping a key methodological slide reduces
                      coverage. Positive means worse. Bold marks the metric each damage
                      targets.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Damage applied</th>
                            <th>Narrative defects</th>
                            <th>Grounding errors</th>
                            <th>Figure errors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sensitivity.rows.map((row) => (
                            <tr key={row.damage}>
                              <td>{row.damage}</td>
                              <td className={`num ${row.target === "narrative" ? "best" : ""}`}>
                                {row.narrative > 0 ? "+" : ""}
                                {row.narrative.toFixed(2)}
                              </td>
                              <td className={`num ${row.target === "grounding" ? "best" : ""}`}>
                                {row.grounding > 0 ? "+" : ""}
                                {row.grounding.toFixed(2)}
                              </td>
                              <td className={`num ${row.target === "figure" ? "best" : ""}`}>
                                {row.figure > 0 ? "+" : ""}
                                {row.figure.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="tbl-note">
                      <strong>Table 7.</strong> Mean change per metric across 15 damaged
                      SlideLab decks.
                    </p>
                  </>
                ),
              },
              {
                label: "Why the others miss",
                content: (
                  <div className="evidence-prose">
                    <p>
                      Degrading a figure and shuffling order are caught by everything,
                      because both change what a judge sees at a glance. Falsified numbers
                      and dropped slides are not.
                    </p>
                    <h3>Falsified numbers</h3>
                    <p>
                      SlidesGen-Bench quizzes from the source paper, so a slide that
                      contradicts it leaves quiz accuracy unchanged. PresentBench moved
                      the wrong way, its pass rate rising from 27.5% to 45.0%.
                    </p>
                    <h3>Dropped slides</h3>
                    <p>
                      PPTEval has no coverage axis, so a missing methodology slide cannot
                      register. A missing slide does not change how a deck looks &mdash;
                      only what the room walks away understanding, which requires an
                      evaluation that tries to follow the talk.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
