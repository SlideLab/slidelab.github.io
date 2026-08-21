import { site } from "../site.config";

/**
 * Colophon — how to cite the work, what is released, and where the
 * numbers on this page came from.
 */
export default function Colophon() {
  return (
    <footer className="colophon" id="citation">
      <div className="colophon-inner">
        <div className="colophon-grid">
          <div>
            <p className="eyebrow">{site.name}</p>
            <h2>Citation</h2>
            <pre className="bibtex">
{`@inproceedings{slidelab2026,
  title     = {${site.title}},
  author    = {${site.authors.map((author) => author.name).join(" and ")}},
  year      = {2026}
}`}
            </pre>
            <p className="colophon-note">
              Every figure, table, and number on this site is taken from the submitted
              manuscript and its appendix. The paper is under review, so the code and
              the annotation platform follow after the review period.
            </p>
          </div>

          <div className="colophon-facts">
            <div className="colophon-fact">
              <span className="label">Paper</span>
              <p>
                <a href={site.links.paper}>Submission (PDF)</a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Code &amp; data</span>
              <p>{site.release.code}.</p>
            </div>
            <div className="colophon-fact">
              <span className="label">Authors</span>
              <p>
                {site.authors.map((author, index) => (
                  <span key={author.name}>
                    {index > 0 && ", "}
                    <a href={author.url}>{author.name}</a>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
