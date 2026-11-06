import { ChevronIcon, CopyrightIcon, ExternalLinkIcon } from "@/app/_components/icons/CustomIcons";
import type { RightsStatement } from "@/app/_utils/fetchUtils/getRightsStatements";
import "./CopyrightCard.css";

interface Props {
  /** The item's rights_holder */
  holder?: string | null;
  /** The item's rights URI */
  uri?: string | null;
  /** The lookup table row for that URI, if there is one */
  statement?: RightsStatement | null;
}

/**
 * The rightsstatements.org page for a statement, which people can read
 * (the /vocab/ URI is the machine-readable one).
 * e.g. "http://rightsstatements.org/vocab/InC/1.0/" → "https://rightsstatements.org/page/InC/1.0/?language=en"
 */
const readableUrl = (uri: string) =>
  uri.includes("rightsstatements.org/vocab/")
    ? `${ uri.replace(/^http:/, "https:").replace("/vocab/", "/page/").replace(/[?#].*$/, "") }?language=en`
    : uri;

/**
 * Collapsible Copyright card for the item page: the rights holder, the rights statement from the
 * RightsStatement lookup table, its text and a link to the full statement. Without a matching
 * statement it shows the rights URI as a link instead.
 *
 * @returns the card, or nothing if the item has no rights or rights holder
 */
export default function CopyrightCard({ holder, uri, statement }: Props) {
  if (!holder && !uri) return null;

  const link = statement?.rightsURI ?? uri;

  return (
    <details className="copyright-card" open>
      <summary>
        <span className="copyright-card__title">
          <CopyrightIcon />
          <h2>Copyright</h2>
        </span>
        <ChevronIcon />
      </summary>

      <div className="copyright-card__body">
        <dl>
          { holder && (
            <div>
              <dt>Rights Holder</dt>
              <dd>{ holder }</dd>
            </div>
          ) }
          { statement ? (
            <div>
              <dt>Rights Statement</dt>
              <dd>{ statement.rightsCode } ({ statement.rightsLabel })</dd>
            </div>
          ) : uri && (
            <div>
              <dt>Rights</dt>
              <dd><a href={ uri }>{ uri }</a></dd>
            </div>
          ) }
        </dl>

        { statement?.rightsStatementText && (
          <p className="copyright-card__text">{ statement.rightsStatementText }</p>
        ) }

        { statement && link && (
          <a className="copyright-card__button" href={ readableUrl(link) } target="_blank" rel="noopener noreferrer">
            Full Rights Statement
            <ExternalLinkIcon />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        ) }
      </div>
    </details>
  );
}
