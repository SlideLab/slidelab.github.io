import EvidenceDrawer from "./EvidenceDrawer";
import { attendees } from "../site.config";

/* The three stages of a simulated talk, from Section 4. */
const STAGES = [
  {
    step: "Presentation",
    body: "The talk runs slide by slide — the examiner checks each slide against the paper while attendees note what they cannot follow.",
  },
  {
    step: "Q&A",
    body: "Questions go to the presenter by priority; the examiner labels why each arose — missing, unclear, buried, or beyond scope.",
  },
  {
    step: "Assessment",
    body: "Observation becomes six measures, not one score — each rank-normalised within a paper, averaged with equal weight.",
  },
];

/* The six measures, defined as Section 4.5 defines them. */
const METRICS = [
  { name: "Grounding errors", scope: "per slide", dir: "lower", definition: "Claims the paper does not support, including wrong numbers." },
  { name: "Figure errors", scope: "per slide", dir: "lower", definition: "Figures the paper does not support, or that are illegible." },
  { name: "Design", scope: "per slide", dir: "higher", definition: "How clean and readable the slide looks, scored 1 to 5." },
  { name: "Figure use", scope: "per slide", dir: "higher", definition: "How well the figures support the slide's content, 1 to 5." },
  { name: "Narrative errors", scope: "whole talk", dir: "lower", definition: "Breaks in flow — results before method, or a missing conclusion." },
  { name: "Coverage", scope: "whole talk", dir: "higher", definition: "The fraction of the paper's key points that reach the deck." },
];

export default function ConfArenaChapter() {
  return (
    <section className="research-chapter confarena-chapter" id="confarena">
      <div className="chapter-inner">
        <p className="chapter-index">
          <span>02</span>
          <span>ConfArena</span>
        </p>

        <header className="chapter-head">
          <h2>Evaluate the talk, not the artifact</h2>
          <p>
            A finished deck is not the talk — understanding builds slide by slide,
            and the failures surface as questions.
          </p>
        </header>

        <div className="block">
          <h3 className="block-head">
            <i className="block-mark" aria-hidden="true" />
            The room
          </h3>
          <div className="room">
            <div className="room-side">
              <p className="room-label">Reads the full paper</p>
              <ul className="room-roles">
                <li>
                  <strong>Presenter</strong>
                  <span>Answers questions as the author.</span>
                </li>
                <li>
                  <strong>Examiner</strong>
                  <span>The reference for every evaluation.</span>
                </li>
              </ul>
            </div>

            <div className="room-side room-audience">
              <p className="room-label">Sees only the slide deck</p>
              <ul className="room-roles">
                {attendees.map((attendee) => (
                  <li key={attendee.name}>
                    <strong>{attendee.name}</strong>
                    <span>{attendee.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="block">
          <h3 className="block-head">
            <i className="block-mark" aria-hidden="true" />
            How the talk runs
          </h3>
          <ol className="arena-stages">
            {STAGES.map((stage, index) => (
              <li key={stage.step}>
                <span className="stage-num" aria-hidden="true">{index + 1}</span>
                <p className="arena-step">{stage.step}</p>
                <p className="arena-body">{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="block">
          <h3 className="block-head">
            <i className="block-mark" aria-hidden="true" />
            What it measures
          </h3>
          <div className="tbl-scroll metric-table-scroll">
            <table className="tbl metric-table">
              <thead>
                <tr>
                  <th>Measure</th>
                  <th>Scope</th>
                  <th style={{ textAlign: "left" }}>What it counts</th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric) => (
                  <tr key={metric.name}>
                    <td>
                      <span className="metric-name">
                        {metric.name}
                        <span className={`metric-dir metric-dir-${metric.dir}`} aria-label={`${metric.dir} is better`}>
                          {metric.dir === "lower" ? "↓" : "↑"}
                        </span>
                      </span>
                    </td>
                    <td className="metric-scope">{metric.scope}</td>
                    <td className="metric-def">{metric.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="system-actions">
          <EvidenceDrawer
            title="The audience, and why it is described so briefly"
            actionLabel="Attendee personas and configuration"
            tabs={[
              {
                label: "Personas",
                content: (
                  <>
                    <p className="drawer-intro">
                      Each attendee has a focus, a question trigger, and a short
                      role — nothing more. Detailed personas degrade LLM judgment.
                    </p>
                    <div className="tbl-scroll">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Attendee</th>
                            <th style={{ textAlign: "left" }}>Focus and question trigger</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendees.map((attendee) => (
                            <tr key={attendee.name}>
                              <td>{attendee.name}</td>
                              <td style={{ textAlign: "left", whiteSpace: "normal" }}>
                                {attendee.focus} {attendee.trigger}
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
                label: "Configuration",
                content: (
                  <div className="evidence-prose">
                    <p>
                      Every role is an independent model call on gpt-5.4 at
                      temperature 0.2 with medium reasoning effort. Only the
                      per-slide visual pass sees the rendered slide image; every
                      other call works from slide text and the source paper.
                    </p>
                    <h3>Comparison protocol</h3>
                    <p>
                      PPTEval, PresentBench, and SlidesGen-Bench run with their
                      default settings and gpt-5.4 as judge, so no system benefits
                      from a stronger judge.
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
