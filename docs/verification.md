# Verification record

Preparation workspace reviewed 26 October 2026. This record concerns repository integrity and workbook behavior, not tactile-engine accuracy or reproduction of earlier experiments.

## Automated repository checks

Run `node scripts/check.mjs` from the root (`npm run check` if npm is installed). It checks maintained local document/HTML links, unique IDs and required fields in the 28-entry industry map and 45-question bank, milestone dependencies/evidence requirements, SHA256 hashes for 22 archived inputs, generated workbook data freshness, and JavaScript syntax. The local check passed using Node 24.22.1; npm is not present on this task's executable path.

After editing canonical JSON, run `node scripts/sync-data.mjs` (`npm run sync` with npm); this regenerates `web/knowledge.js`, allowing the browser workbook to use the same catalog/questions without network fetches. Changing this generated file by hand fails the freshness check. Source snapshots are marked non-text in `.gitattributes` so Git preserves the exact bytes on different operating systems.

Archived original Markdown links are intentionally excluded: these snapshots preserve original bytes and may refer to omitted files in their upstream repositories. Pinned upstream links are in the manifest. External links were selected from checked primary sources; the automated checker does not establish their future availability or scientific correctness.

## Browser QA

The local HTTP preview was inspected in the in-app Chromium browser and Chrome. Checks completed:

- All six views navigate and display the intended content. The six views were also checked at a 390 x 844 viewport (375 px content width with a scrollbar); none produced page-wide horizontal overflow. Tables retain their own horizontal scrolling.
- All 14 slides advance with one visible slide at a time, correct counters and no horizontal page overflow at the desktop size. Home/End and Escape navigation were exercised; first/last controls disable correctly. Representative slide layouts and the desktop/mobile workbook were visually inspected.
- Catalog search filtered HydroShear to one of 28 entries. The canonical question bank loaded all 45 questions; category filtering, next-question and reveal/hide behavior were exercised.
- The ten-minute timer started, paused at a decreased time, and reset to 10:00. This is a UI timer, not a measurement of product execution speed.
- A personal checklist mark survived reload; test marks were removed. Export produced JSON. Invalid non-boolean import was rejected; a valid test import updated personal tracking.
- Native JavaScript confirmation stalled an earlier in-app test tab. Both native confirmations were replaced with accessible in-page dialogs. In Chrome, cancellation preserved the mark and confirmed reset restored 0 / 20 with the success message. The dialog returns focus to its trigger.
- The inspected final Chrome page reported no warning/error console logs. A screenshot is saved as [workbook preview](assets/workbook-preview.png).
- HTTP checks returned 200 for workbook assets, a maintained document and source PDF; the local server rejected `.git` access, missing paths and POST requests with the expected 403/404/405 statuses.

Browser automation permits HTTP/HTTPS and rejected direct `file://` navigation, so direct-file opening was not browser-tested. The workbook uses relative static scripts and embedded data without fetches and is designed for manual local-file opening. HTTP preview is the verified path. Print-all CSS was inspected; no printed PDF/export was produced or visually validated.

## Scientific and account boundaries

- No force/contact/simulation benchmark was run; no measured product performance is claimed.
- Prior research tests and toy metrics remain attributed to their saved reports.
- No raw or reserved study signals were accessed.
- No application was submitted, no customers were contacted, and no founder/business facts were invented.
- The GitHub repository is private; the HTML is a local repository artifact, not a published public website.

