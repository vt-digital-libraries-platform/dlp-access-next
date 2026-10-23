"use client";

import { useState, type ReactNode } from "react";
import type { MetadataField } from "@/app/_utils/fetchUtils/getMetadataFields";

// Which fields are shown, by marker; each has a checkbox in the legend.
type ShownMarkers = { system: boolean, sip: boolean, facet: boolean };

// System-generated fields follow only their own checkbox. Other fields show when any of their
// markers is ticked; fields with no markers always show.
const isShown = (field: MetadataField, shown: ShownMarkers) => {
  if (field.isSystemGenerated) return shown.system;
  if (!field.isSIPRequired && !field.isFacetRequired) return true;
  return (field.isSIPRequired && shown.sip) || (field.isFacetRequired && shown.facet);
};

// Plain URLs in descriptions and examples become links, like dlp-access's autoLinkHTML.
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;

const linkify = (text: string): ReactNode[] =>
  text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1
      ? <a key={ i } href={ part.startsWith("www.") ? `https://${ part }` : part }>{ part }</a>
      : part
  );

// A marker matches only on its own words: "required" alone finds the (Required) fields,
// not every "SIP required" / "Facet required" field
const matchesMarker = (markerText: string, query: string) =>
  markerText.includes(query) && !"required".includes(query);

const matchesSearch = (field: MetadataField, searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  return (
    query === "" ||
    field.columnName.toLowerCase().includes(query) ||
    field.labelName.toLowerCase().includes(query) ||
    field.type.toLowerCase().includes(query) ||
    (field.required === "Yes" && "required".includes(query)) ||
    (field.required === "Conditional" && "conditional".includes(query)) ||
    (field.isSystemGenerated && matchesMarker("system generated", query)) ||
    (field.isSIPRequired && matchesMarker("sip required", query)) ||
    (field.isFacetRequired && matchesMarker("facet required", query)) ||
    field.description.toLowerCase().includes(query) ||
    field.example.toLowerCase().includes(query)
  );
};

// Same CSV as dlp-access: one column per field, rows for name, label, type, description, example.
const downloadCSV = (metadataFields: MetadataField[]) => {
  const columnNames = metadataFields.map((field) => field.columnName);
  const labelNames = metadataFields.map((field) =>
    field.required === "Yes"
      ? `${ field.labelName } (Required)`
      : field.required === "Conditional"
        ? `${ field.labelName } (Conditional)`
        : field.labelName
  );
  const types = metadataFields.map((field) => field.type);
  const descriptions = metadataFields.map((field) => field.description);
  const examples = metadataFields.map((field) => field.example);

  const rows = [
    ["Metadata Column Name", ...columnNames],
    ["Label Name", ...labelNames],
    ["Type", ...types],
    ["Description", ...descriptions],
    ["Example", ...examples],
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${ cell }"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "metadata_field_reference.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function FieldFlags({ field }: { field: MetadataField }) {
  if (!field.isSystemGenerated && !field.isSIPRequired && !field.isFacetRequired) return null;

  return (
    <span className="field-flags">
      { field.isSystemGenerated && (
        <span className="field-flag field-flag--system"><span aria-hidden="true">⚙️ </span>System generated</span>
      ) }
      { field.isSIPRequired && (
        <span className="field-flag field-flag--sip"><span aria-hidden="true">📦 </span>SIP required</span>
      ) }
      { field.isFacetRequired && (
        <span className="field-flag field-flag--facet"><span aria-hidden="true">🏷️ </span>Facet required</span>
      ) }
    </span>
  );
}

interface Props {
  fields: MetadataField[] | null
}

/**
 * The Metadata Guide's intro, CSV download, search and field table, like dlp-access's
 * MetadataPage, plus markers for system-generated, SIP-required and facet-required fields.
 *
 * @param fields The metadata fields from getMetadataFields, or null if they couldn't be loaded
 * @returns the metadata guide
 */
export default function MetadataGuide({ fields }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shown, setShown] = useState<ShownMarkers>({ system: true, sip: true, facet: true });
  const toggleMarker = (marker: keyof ShownMarkers) =>
    setShown((prev) => ({ ...prev, [marker]: !prev[marker] }));

  const metadataFields = fields ?? [];
  // Fields whose column name or label matches come first; the rest keep their order below them
  const query = searchQuery.toLowerCase();
  const nameMatches = (field: MetadataField) =>
    query !== "" && (field.columnName.toLowerCase().includes(query) || field.labelName.toLowerCase().includes(query));
  const visibleFields = metadataFields
    .filter((field) => isShown(field, shown) && matchesSearch(field, searchQuery))
    .sort((a, b) => Number(nameMatches(b)) - Number(nameMatches(a)));
  const resultsMessage = visibleFields.length > 0 || metadataFields.length === 0
    ? ""
    : searchQuery
      ? "No metadata fields match your search criteria."
      : "No fields to show. Tick a marker above to show its fields.";

  return (
    <div className="container metadata-page-wrapper typography-wrapper secondary-page">
      <h1>Metadata Guide</h1>
      { !fields && <p className="error-message">Couldn&apos;t load the metadata fields. Please try again later.</p> }
      { fields && (
        <div>
          <div className="metadata-intro">
            <p className="lead">
              This guide provides detailed information about metadata fields
              used in the digital library platform. Fields marked as
              &quot;Required&quot; are mandatory. This is for basic metadata fields
              but for more complex metadata schemas (e.g., 3D objects)
              please contact{ " " }
              <a href="mailto:digitallibraries@vt.edu">
                digitallibraries@vt.edu
              </a>
              .
            </p>
            <button
              className="button-link--primary download-csv-btn focusable"
              role="link"
              onClick={ () => downloadCSV(metadataFields) }
            >
              <span className="visually-hidden">
                Download metadata field reference as CSV
              </span>
              <span aria-hidden="true">⬇ Download CSV</span>
            </button>
          </div>
          <h2 id="metadata-table-heading">Metadata Field Reference</h2>
          <search>
            <h3>Search Metadata Fields</h3>
            <input
              type="search"
              className="field-search-input"
              aria-labelledby="metadata-search-input-label"
              value={ searchQuery }
              onChange={ (e) => setSearchQuery(e.target.value) }
            />
            <p id="metadata-search-input-label">
              Search by name, label, type, or description. Results will be
              filtered as you type.
            </p>
            <h3>Results</h3>
            <ul className="metadata-legend" aria-label="Field markers: untick one to hide the fields that have it">
              <li>
                <label>
                  <input type="checkbox" checked={ shown.system } onChange={ () => toggleMarker("system") } />
                  <span className="field-flag field-flag--system"><span aria-hidden="true">⚙️ </span>System generated</span>:
                  filled in automatically; you don&apos;t provide it in the CSV
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={ shown.sip } onChange={ () => toggleMarker("sip") } />
                  <span className="field-flag field-flag--sip"><span aria-hidden="true">📦 </span>SIP required</span>:
                  used by the SIP program
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={ shown.facet } onChange={ () => toggleMarker("facet") } />
                  <span className="field-flag field-flag--facet"><span aria-hidden="true">🏷️ </span>Facet required</span>:
                  used as a search facet
                </label>
              </li>
            </ul>
            <section className="table-responsive metadata-table-section">
              <table className="metadata-table" tabIndex={ 0 } role="table">
                <caption className="visually-hidden">
                  Metadata field reference table with column names, label
                  names, data types, descriptions, and examples
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Metadata Column Name</th>
                    <th scope="col">Label Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Example</th>
                  </tr>
                </thead>
                <tbody id="metadata-table-body">
                  { visibleFields.map((field) => (
                    <tr key={ field.id } className={ field.isSystemGenerated ? "system-generated-row" : undefined }>
                      <th scope="row" className="column-name">
                        { field.columnName }
                        { field.required === "Yes" ? (
                          <>
                            <br />
                            <span className="required-indicator">
                              (Required)
                            </span>
                          </>
                        ) : field.required === "Conditional" ? (
                          <>
                            <br />
                            <span className="required-indicator conditional-indicator">
                              (Conditional)
                            </span>
                          </>
                        ) : null }
                        <FieldFlags field={ field } />
                      </th>
                      <td className="label-name">{ field.labelName }</td>
                      <td className="type">{ field.type }</td>
                      <td className="description">{ linkify(String(field.description)) }</td>
                      <td className="example">
                        <code>{ linkify(String(field.example)) }</code>
                      </td>
                    </tr>
                  )) }
                </tbody>
              </table>
              <div
                aria-live="assertive"
                aria-atomic="true"
                id="no-results-live-region"
              >
                { resultsMessage }
              </div>
            </section>
          </search>
        </div>
      ) }
    </div>
  );
}
