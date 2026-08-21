import EvidenceDrawer from "./EvidenceDrawer";
import { stageConfig, cost } from "../site.config";

/* The four stages, each stated the way Section 3 states it. */
const STAGES = [
  {
    name: "Planner",
    heading: "Plan the narrative before writing any slide",
    body: "Reads every section, figure, and table, and produces several candidate blueprints. A second agent critiques them and keeps the one with the most coherent flow. For each slide the blueprint fixes the title, a one-sentence takeaway, the source, which figures to include, and whether a new visual is needed.",
  },
  {
    name: "Visual Generator",
    heading: "Add a diagram only where one is needed",
    body: "Where a concept needs a diagram the paper lacks, the generator leaves a VISUAL_SLOT. The Visual Generator reads the relevant sections and writes a prompt for an image model, matching the deck's palette. A visual is added only when the content needs one, not on every slide.",
  },
  {
    name: "Compositor",
    heading: "Edit the deck once it exists",
    body: "Works on the finished deck, not before generation. It can reorder, drop, or merge slides, move figures, and open a visual slot where a slide is too text-heavy. It holds the full paper, so every edit is checked against the source.",
  },
  {
    name: "LayoutDebugger",
    heading: "Render every slide, then check it against the paper",
    body: "Each slide is rendered to PNG and passed to a multimodal agent, which returns corrected HTML and is re-rendered for up to three rounds. Grounding is then verified by a long-context model holding both the HTML and the original paper.",
  },
];

export default function SystemChapter() {
  return (
    <section className="research-chapter system-chapter" id="system">
      <div className="chapter-inner">
        <p className="chapter-index">
          <span>01</span>
          <span>The system</span>
        </p>

        <header className="chapter-head">
          <h2>SlideLab plans the talk, then builds and repairs it</h2>
          <p>
            SlideLab builds on feedback from human annotations that reveal several flaws
            in existing slide generation frameworks: poor narrative flow, grounding
            issues, poor layout aesthetics, and high cost. The framework is training-free.
          </p>
        </header>

        <figure className="system-figure">
          <img
            src="/img/architecture.png"
            alt="The SlideLab pipeline. A research paper enters the Planner, which produces a slide blueprint and narration arc. The Generator writes slides section by section, opening visual slots. The Visual Generator fills those slots and the Compositor reorders and verifies the deck. The Layout Debugger renders each slide and applies targeted fixes, producing the presentation and a narration script."
          />
          <figcaption>
            <strong>Figure 1.</strong> Narrative planning, figure design, flow
            restructuring, layout debugging, and grounding. The agents share one slide
            deck and a common set of tools for reading the paper and editing slides.
          </figcaption>
        </figure>

        <div className="stage-grid">
          {STAGES.map((stage) => (
            <article key={stage.name} className="stage">
              <p className="stage-name">{stage.name}</p>
              <h3>{stage.heading}</h3>
              <p className="stage-body">{stage.body}</p>
            </article>
          ))}
        </div>

        <div className="system-actions">
          <EvidenceDrawer
            title="What runs each stage, and what it costs"
            actionLabel="Models, rounds, and cost per deck"
            tabs={[
              {
                label: "Configuration",
                content: (
                  <>
                    <p className="drawer-intro">
                      All text agents run at temperature 1.0 with high reasoning effort.
                      The Planner, Slide Generator, and Compositor each run as a tool-use
                      loop; hitting the round limit forces the agent to produce its final
                      output from what it has gathered so far.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Stage</th>
                            <th>Model</th>
                            <th>Max multi-turn rounds</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stageConfig.map((row) => (
                            <tr key={row.stage}>
                              <td>{row.stage}</td>
                              <td>{row.model}</td>
                              <td className="num">{row.rounds}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ),
              },
              {
                label: "Cost",
                content: (
                  <>
                    <p className="drawer-intro">
                      Average wall-clock time, API cost, and token usage per deck, from
                      production logs on the 100-paper set. Cost includes image
                      generation, which dominates the Visual Generator and Compositor
                      stage. The saving over DeepPresenter comes mainly from the Planner
                      reading the paper once and the Slide Generator working slide by
                      slide against a fixed blueprint, rather than reflecting over the
                      whole deck repeatedly.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Stage</th>
                            <th>Time (s)</th>
                            <th>Cost ($)</th>
                            <th>Tokens (M)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cost.stages.map((row) => (
                            <tr key={row.stage}>
                              <td>{row.stage}</td>
                              <td className="num">{row.seconds}</td>
                              <td className="num">{row.dollars.toFixed(2)}</td>
                              <td className="num">{row.tokens.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="rule-above ours">
                            <td>SlideLab total</td>
                            <td className="num">{cost.total.seconds}</td>
                            <td className="num">{cost.total.dollars.toFixed(2)}</td>
                            <td className="num">{cost.total.tokens.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>DeepPresenter</td>
                            <td className="num">{cost.deepPresenter.seconds}</td>
                            <td className="num">{cost.deepPresenter.dollars.toFixed(2)}</td>
                            <td className="num">{cost.deepPresenter.tokens.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
