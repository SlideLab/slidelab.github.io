import EvidenceDrawer from "./EvidenceDrawer";
import {
  confarena,
  ablations,
  externalBenchmarks,
  preference,
  humanDimensions,
} from "../site.config";

/** Format a cell, dropping to an em dash where the system produced no value. */
const cell = (value: number | null, digits: number) =>
  value === null ? <span className="none">&mdash;</span> : value.toFixed(digits);

/** The best value in a column, so bolding is derived and not hand-maintained. */
function bestOf(key: string, better: string) {
  const values = confarena.rows
    .map((row) => (row as Record<string, unknown>)[key])
    .filter((value): value is number => typeof value === "number");
  return better === "lower" ? Math.min(...values) : Math.max(...values);
}

export default function ResultsChapter() {
  return (
    <section className="research-chapter results-chapter" id="results">
      <div className="chapter-inner">
        <p className="chapter-index">
          <span>03</span>
          <span>Results</span>
        </p>

        <header className="chapter-head">
          <h2>Highest coverage, without paying for it in errors</h2>
          <p>
            PPTAgent, DeepPresenter, and SlideLab each generate three presentations per
            paper on the 100-paper set. Kimi Slides and Manus are web applications with
            usage limits, so they generate one. Every deck is evaluated independently.
          </p>
        </header>

        <figure className="results-table">
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="no-rule" />
                  <th className="span" colSpan={4}>
                    Per slide
                  </th>
                  <th className="span" colSpan={3}>
                    Whole talk
                  </th>
                </tr>
                <tr>
                  <th>System</th>
                  {confarena.columns.map((column) => (
                    <th key={column.key}>
                      {column.label} {column.better === "lower" ? "↓" : "↑"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {confarena.rows.map((row) => {
                  const record = row as Record<string, unknown>;
                  return (
                    <tr
                      key={row.system}
                      className={`${"ours" in row && row.ours ? "ours rule-above" : ""}`}
                    >
                      <td>{row.system}</td>
                      {confarena.columns.map((column) => {
                        const value = record[column.key] as number | null;
                        const digits = column.key === "design" || column.key === "figureUse" ? 2 : 2;
                        const isBest =
                          typeof value === "number" && value === bestOf(column.key, column.better);
                        return (
                          <td key={column.key} className={`num ${isBest ? "best" : ""}`}>
                            {cell(value, digits)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <figcaption className="tbl-note">
            <strong>Table 1.</strong> ConfArena results, 100 papers &times; 3 seeds. The
            environment score is a rank-normalised composite of the six measures, from 0
            to 1. Best in each column in bold. Manus decks are delivered without separable
            figures, so figure measures do not apply.
          </figcaption>
        </figure>

        {/* The two readings the table supports, stated once each. */}
        <div className="reading-grid">
          <section className="reading reading-ours">
            <p className="reading-label">SlideLab</p>
            <p className="reading-body">
              Best on every axis except figure errors, and the only system to reach
              near-complete coverage without accumulating grounding errors.
            </p>
            <p className="reading-figure">
              <strong>0.99</strong>
              <span>coverage, at 0.71 grounding errors per slide</span>
            </p>
          </section>

          <section className="reading">
            <p className="reading-label">DeepPresenter</p>
            <p className="reading-body">
              The opposite trade: it includes more content, and accumulates grounding
              errors and weaker narrative flow along the way.
            </p>
            <p className="reading-figure">
              <strong>2.08</strong>
              <span>grounding errors per slide, the highest measured</span>
            </p>
          </section>
        </div>

        <div className="system-actions">
          <EvidenceDrawer
            title="Ablations, human ratings, and existing benchmarks"
            actionLabel="What each component contributes"
            tabs={[
              {
                label: "Ablations",
                content: (
                  <>
                    <p className="drawer-intro">
                      Each component removed and the system re-scored on the 100-paper
                      set. The Planner is the largest drop, because the Generator loses
                      its blueprint; the LayoutDebugger costs mainly design and figure
                      legibility. Run once per paper, so the full system scores 0.70
                      here, not the 0.73 of Table 1, which averages three runs.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Configuration</th>
                            <th>Env. score ↑</th>
                            <th>Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="ours">
                            <td>SlideLab (full)</td>
                            <td className="num">{ablations.full.toFixed(2)}</td>
                            <td className="num none">&mdash;</td>
                          </tr>
                          {ablations.rows.map((row) => (
                            <tr key={row.label}>
                              <td>&minus; {row.label}</td>
                              <td className="num">{row.env.toFixed(2)}</td>
                              <td className="num">
                                {(row.env - ablations.full).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ),
              },
              {
                label: "Existing benchmarks",
                content: (
                  <>
                    <p className="drawer-intro">
                      The same decks scored by three published benchmarks. SlideLab leads
                      on all three PPTEval dimensions and on SlidesGen-Bench, and ranks
                      second on PresentBench, where Kimi Slides is marginally ahead. The
                      orderings broadly match ConfArena, so the gains are not an artifact
                      of the evaluation we propose.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th className="no-rule" />
                            <th className="span" colSpan={3}>
                              PPTEval (1&ndash;5)
                            </th>
                            <th className="no-rule" />
                            <th className="no-rule" />
                          </tr>
                          <tr>
                            <th>System</th>
                            <th>Content ↑</th>
                            <th>Design ↑</th>
                            <th>Coherence ↑</th>
                            <th>PresentBench pass % ↑</th>
                            <th>SlidesGen quiz acc. ↑</th>
                          </tr>
                        </thead>
                        <tbody>
                          {externalBenchmarks.rows.map((row) => {
                            const record = row as unknown as Record<string, number>;
                            /* highest wins on every column here */
                            const isTop = (key: string) =>
                              record[key] ===
                              Math.max(
                                ...externalBenchmarks.rows.map(
                                  (candidate) =>
                                    (candidate as unknown as Record<string, number>)[key],
                                ),
                              );
                            return (
                              <tr
                                key={row.system}
                                className={"ours" in row && row.ours ? "ours rule-above" : ""}
                              >
                                <td>{row.system}</td>
                                <td className={`num ${isTop("content") ? "best" : ""}`}>{row.content.toFixed(1)}</td>
                                <td className={`num ${isTop("design") ? "best" : ""}`}>{row.design.toFixed(1)}</td>
                                <td className={`num ${isTop("coherence") ? "best" : ""}`}>{row.coherence.toFixed(1)}</td>
                                <td className={`num ${isTop("presentBench") ? "best" : ""}`}>{row.presentBench}</td>
                                <td className={`num ${isTop("slidesGen") ? "best" : ""}`}>{row.slidesGen.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="tbl-note">
                      <strong>Table 4.</strong> Evaluations on the 100-paper set using the
                      other three methods. PresentBench reports the fraction of decks
                      passing its checks; SlidesGen-Bench reports accuracy on quizzes it
                      generates from the source paper.
                    </p>
                  </>
                ),
              },
              {
                label: "Human study",
                content: (
                  <div className="evidence-prose">
                    <p>
                      Ten annotators &mdash; graduate students, PhD students, and faculty
                      &mdash; saw four anonymous decks in randomised order with the source
                      paper, and picked the one they would present at a conference.
                      SlideLab was chosen for {preference.ours} of {preference.total}{" "}
                      papers ({preference.percent}%), {preference.runnerUp.name} for the
                      remaining {preference.runnerUp.papers}. Neither DeepPresenter nor
                      Manus was picked for any paper.
                    </p>
                    <p>
                      After choosing, annotators rated the deck on six dimensions with a
                      five-point scale, so they would weigh each aspect rather than form
                      one overall impression.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Dimension</th>
                            <th style={{ textAlign: "left" }}>What annotators are asked</th>
                          </tr>
                        </thead>
                        <tbody>
                          {humanDimensions.map((dimension) => (
                            <tr key={dimension.name}>
                              <td>{dimension.name}</td>
                              <td style={{ textAlign: "left", whiteSpace: "normal" }}>
                                {dimension.question}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <h3>What the comments said</h3>
                    <p>
                      Manus drew complaints for text-heavy slides and missing visuals; in
                      several cases it inserted screenshots of whole paper pages.
                      DeepPresenter drew layout complaints, unsuitable generated figures,
                      and the most comments about factual errors. Kimi Slides was
                      well-structured but often overcrowded, with the fewest factual
                      complaints.
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
