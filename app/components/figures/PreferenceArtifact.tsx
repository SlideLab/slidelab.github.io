import { preference, cost } from "../../site.config";

/**
 * The opening artifact: the blind preference study, drawn as the ballot it
 * was. Ten annotators, thirty papers, four anonymised decks each time.
 */
export default function PreferenceArtifact() {
  const { ours, total, percent, runnerUp, zeroPick } = preference;
  const tokenRatio = Math.round((cost.deepPresenter.tokens / cost.total.tokens) * 10) / 10;

  return (
    <figure className="preference-artifact">
      <div className="ballot">
        <header className="ballot-head">
          <span>Blind preference study</span>
          <span>{total} papers &middot; 10 annotators</span>
        </header>

        <p className="ballot-question">
          Which of these four decks would you use to present this paper at a conference?
        </p>

        {/* one square per paper: filled where SlideLab was chosen */}
        <div className="ballot-grid" role="img"
          aria-label={`${ours} of ${total} papers went to SlideLab, ${runnerUp.papers} to ${runnerUp.name}`}>
          {Array.from({ length: total }, (_, index) => (
            <span key={index} className={index < ours ? "pick pick-ours" : "pick"} />
          ))}
        </div>

        <div className="ballot-tally">
          <div className="tally-ours">
            <strong>{ours}<i>/</i>{total}</strong>
            <span>SlideLab &middot; {percent}%</span>
          </div>
          <div className="tally-rest">
            <p>
              <b>{runnerUp.papers}</b> {runnerUp.name}
            </p>
            {zeroPick.map((system) => (
              <p key={system}>
                <b>0</b> {system}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="artifact-support">
        <p>
          <strong>{tokenRatio}&times;</strong>
          <span>fewer inference tokens than the strongest open-source baseline</span>
        </p>
        <p>
          <strong>${cost.total.dollars.toFixed(2)}</strong>
          <span>average API cost per deck, generated in {cost.total.seconds} seconds</span>
        </p>
      </div>

      <figcaption>
        Annotators saw four anonymised decks in randomised order alongside the source
        paper, and picked the one they would present. Neither DeepPresenter nor Manus
        was selected for any paper.
      </figcaption>
    </figure>
  );
}
