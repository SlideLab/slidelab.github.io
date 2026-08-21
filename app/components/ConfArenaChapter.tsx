import EvidenceDrawer from "./EvidenceDrawer";
import { attendees } from "../site.config";

/* The three stages of a simulated talk, from Section 4. */
const STAGES = [
  {
    step: "Presentation",
    body: "The examiner reads the paper and prepares a checklist of the points that should be communicated. The talk then proceeds slide by slide: the examiner checks each against the paper for unsupported claims and fabricated visuals, while each attendee updates its understanding and decides whether anything is unclear enough to ask.",
  },
  {
    step: "Q&A",
    body: "Collected questions go to the presenter, with priority to those raised by more than one attendee. The examiner then decides why each question arose: information missing, unclear, buried in an unreadable figure, or genuinely beyond the scope of the talk. Only the first three are failures of the deck.",
  },
  {
    step: "Assessment",
    body: "Everything observed is aggregated into six measures rather than one score, each rank-normalised within a paper and averaged with equal weight.",
  },
];

/* The six measures, defined as Section 4.5 defines them. */
const METRICS = [
  { name: "Grounding errors", scope: "per slide", dir: "lower", definition: "Claims on a slide that the paper does not support, including incorrect numerical values." },
  { name: "Figure errors", scope: "per slide", dir: "lower", definition: "Figures that depict content the source paper does not support, or that are illegible." },
  { name: "Design", scope: "per slide", dir: "higher", definition: "How clean and readable the slide looks, scored 1 to 5." },
  { name: "Figure use", scope: "per slide", dir: "higher", definition: "How well the slide's figures support its content, scored 1 to 5." },
  { name: "Narrative errors", scope: "whole talk", dir: "lower", definition: "Breaks in the flow of the talk, such as results appearing before the method, or a missing conclusion." },
  { name: "Coverage", scope: "whole talk", dir: "higher", definition: "The fraction of the paper's key points that actually reach the deck." },
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
            Existing benchmarks score a finished deck against a rubric. But
            understanding develops as a talk progresses, and communication failures
            surface as questions from the room.
          </p>
        </header>

        {/* who is in the room, and what each of them can see */}
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

        <p className="room-note">
          The paper, presenter, examiner, and prompts are fixed for every deck of a
          paper. What differs in the outcome is the deck itself.
        </p>

        <ol className="arena-stages">
          {STAGES.map((stage, index) => (
            <li key={stage.step}>
              <p className="arena-step">
                <span aria-hidden="true">{index + 1}</span>
                {stage.step}
              </p>
              <p className="arena-body">{stage.body}</p>
            </li>
          ))}
        </ol>

        <div className="metric-block">
          <h3 className="metric-heading">What comes out</h3>
          <div className="metric-grid">
            {METRICS.map((metric) => (
              <div key={metric.name} className="metric">
                <p className="metric-name">
                  {metric.name}
                  <span className={`metric-dir metric-dir-${metric.dir}`} aria-label={`${metric.dir} is better`}>
                    {metric.dir === "lower" ? "↓" : "↑"}
                  </span>
                </p>
                <p className="metric-scope">{metric.scope}</p>
                <p className="metric-definition">{metric.definition}</p>
              </div>
            ))}
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
                      Each attendee is defined by three things only: a focus, a question
                      trigger, and a short role description. Detailed personas degrade LLM
                      judgment, and a highly specific description risks representing one
                      stereotype. The same talk can therefore land differently on each
                      listener.
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
                      Every role is an independent model call, all using openai/gpt-5.4
                      at temperature 0.2 with medium reasoning effort. Only the per-slide
                      visual pass receives the rendered slide image; every other call
                      works from the slide text and the source paper.
                    </p>
                    <h3>Comparison protocol</h3>
                    <p>
                      PPTEval, PresentBench, and SlidesGen-Bench run with their default
                      settings and gpt-5.4 as judge, so no system benefits from a stronger
                      judge. Decks average 19.4 slides for SlideLab, 18.5 for
                      DeepPresenter, 19.7 for Kimi Slides, and 14.2 for Manus.
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
