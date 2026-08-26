import EvidenceDrawer from "./EvidenceDrawer";
import { attendees } from "../site.config";

/* The three stages of a simulated talk, from Section 4. */
const STAGES = [
  {
    step: "Presentation",
    body: "The examiner reads the paper, then the talk runs slide by slide: each slide is checked against the paper for unsupported claims, while attendees note what they cannot follow.",
  },
  {
    step: "Q&A",
    body: "Collected questions go to the presenter, prioritised by how many attendees raised them; the examiner then labels why each arose — missing, unclear, buried, or beyond scope.",
  },
  {
    step: "Assessment",
    body: "Everything observed is aggregated into six measures rather than one score, each rank-normalised within a paper and averaged with equal weight.",
  },
];

/* The six measures, defined as Section 4.5 defines them. */
const METRICS = [
  { name: "Grounding errors", scope: "per slide", dir: "lower", def: "Claims on a slide that the paper does not support, including wrong numbers." },
  { name: "Figure errors", scope: "per slide", dir: "lower", def: "Figures that depict content the paper does not support, or that are illegible." },
  { name: "Design", scope: "per slide", dir: "higher", def: "How clean and readable the slide looks, scored 1 to 5." },
  { name: "Figure use", scope: "per slide", dir: "higher", def: "How well the slide's figures support its content, scored 1 to 5." },
  { name: "Narrative errors", scope: "whole talk", dir: "lower", def: "Breaks in the flow — results before the method, or a missing conclusion." },
  { name: "Coverage", scope: "whole talk", dir: "higher", def: "The fraction of the paper's key points that actually reach the deck." },
];

const BLOCKS = [
  { num: "01", label: "The room" },
  { num: "02", label: "How the talk runs" },
  { num: "03", label: "What it measures" },
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
          <h2>A simulated conference room</h2>
          <p>
            A finished deck is not the talk — understanding builds slide by
            slide, and the failures surface as questions.
          </p>
        </header>
      </div>

      {/* room: a two-part split — paper readers vs deck-only */}
      <div className="band band-lift">
        <div className="chapter-inner block">
          <h3 className="block-head">
            <span className="block-num">{BLOCKS[0].num}</span>
            {BLOCKS[0].label}
          </h3>
          <p className="block-lead">
            Two agents read the full paper; three see only the deck. The gap
            between what each side knows is what the evaluation exploits.
          </p>
          <div className="room-split">
            <div className="room-side">
              <p className="room-label">Reads the full paper</p>
              <ul className="room-roles">
                <li>
                  <strong>Presenter</strong>
                  <span>Answers the audience's questions as the paper's author.</span>
                </li>
                <li>
                  <strong>Examiner</strong>
                  <span>Holds the paper and checks every slide claim against it.</span>
                </li>
              </ul>
            </div>
            <div className="room-side">
              <p className="room-label">Sees only the slide deck</p>
              <ul className="room-roles">
                {attendees.map((a) => (
                  <li key={a.name}>
                    <strong>{a.name}</strong>
                    <span>{a.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* stages: a numbered flow */}
      <div className="band">
        <div className="chapter-inner block">
          <h3 className="block-head">
            <span className="block-num">{BLOCKS[1].num}</span>
            {BLOCKS[1].label}
          </h3>
          <ol className="stage-flow">
            {STAGES.map((stage, index) => (
              <li key={stage.step}>
                <span className="stage-num" aria-hidden="true">{index + 1}</span>
                <span className="stage-name">{stage.step}</span>
                <span className="stage-body">{stage.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* measures: a 3×2 grid */}
      <div className="band band-lift">
        <div className="chapter-inner block">
          <h3 className="block-head">
            <span className="block-num">{BLOCKS[2].num}</span>
            {BLOCKS[2].label}
          </h3>
          <ul className="metric-grid">
            {METRICS.map((metric) => (
              <li key={metric.name} className="metric-cell">
                <p className="metric-name">
                  {metric.name}
                  <span className={`metric-dir metric-dir-${metric.dir}`} aria-label={`${metric.dir} is better`}>
                    {metric.dir === "lower" ? "↓" : "↑"}
                  </span>
                  <span className="metric-scope">{metric.scope}</span>
                </p>
                <p className="metric-def">{metric.def}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chapter-inner">
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
