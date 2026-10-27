# Tactile World

A private working repository for preparing a Y Combinator application around **tactile simulation and physically grounded world models**. It brings together the supplied research report, prior project evidence, current primary-source research, a practical PoC plan, and application preparation.

**Research cutoff: 26 October 2026, America/Los_Angeles.** This is a dated, curated working knowledge base, not an exhaustive industry census. Planned experiments, pricing, customer segments, and draft positioning are hypotheses until supported by evidence.

**Confirmed setup:** one tactile sensor available; no robot. Sensor type, force instrumentation, founder/team details, customers, revenue, pricing, burn, and runway still need confirmation. Existing software evidence is offline vibration prediction and a separate synthetic force-prediction pipeline. A physical tactile engine, validated optical simulator, and real policy transfer have not been established.

## Start here

Open **[the interactive preparation workbook](web/index.html)** directly in a browser. It works without installation, internet access, or a build. Use **Present** for the slide deck, the build checklist for personal tracking, and the question drill to practice factual answers rather than memorized speeches. Source links require internet access where applicable.

For an HTTP preview from the repository root:

```powershell
node scripts/serve.mjs
```

Open `http://127.0.0.1:8765/web/`. Stop the server with Ctrl+C. The server binds only to the local machine. If npm is installed, `npm start` is equivalent; no packages need installing.

The workbook's browser-local checklist is a convenience, not shared project evidence. Export its JSON to transfer it between browsers; keep the export private if you add sensitive details. Canonical research and evidence live in the files below. A browser mark does not update Markdown or prove a milestone.

## Read in this order

| Purpose | Maintained reference |
| --- | --- |
| What we can truthfully say today | [Current state](docs/current-state.md) and [evidence ledger](docs/evidence-ledger.md) |
| Industry, competitors, complements, and research gaps | [Industry landscape](docs/industry-landscape.md) and [structured entries](data/industry.json) |
| Long-term vision and concrete interfaces | [Technical architecture](docs/technical-architecture.md) |
| Everything in the supplied report, mapped to next actions | [Report crosswalk](docs/report-crosswalk.md) |
| What to build before filming | [PoC build plan](docs/poc-build-plan.md) and [benchmark contract](docs/benchmark-contract.md) |
| Pre-application work and open decisions | [Readiness checklist](docs/readiness-checklist.md) and [milestone records](data/milestones.json) |
| Application drafts and evidence still needed | [YC application worksheet](docs/yc-application.md) |
| Official guidance versus supplied advice | [YC guidance audit](docs/yc-guidance-audit.md) |
| Customers, buying signals, and first pilots | [Customer discovery](docs/customer-discovery.md) and [business model](docs/business-model.md) |
| Founder communication, objections, and question drill | [Interview playbook](docs/interview-playbook.md) and [question bank](data/questions.json) |
| What to film and what each scene substantiates | [Demo storyboard](docs/demo-storyboard.md) |
| Sources, dates, preserved files, and review depth | [Source index](sources/README.md) and [snapshot manifest](sources/manifest.json) |

## Working cadence

1. Resolve sensor/rig access and choose the first buyer workflow.
2. Attach dated evidence to the ledger when a milestone actually passes; record failures too.
3. Record one weekly progress entry in [the progress log](docs/progress-log.md). Separate this week's measured change from next week's targets.
4. Update the application from supported facts. Leave unknowns visible; do not fill them with plausible numbers.
5. Recheck YC's live form and official sources before submission. Keep the founder introduction separate from the product demonstration.

## Check the repository

```powershell
node scripts/check.mjs
```

After changing the JSON catalogs, run `node scripts/sync-data.mjs` to update the workbook's embedded data. Optional npm equivalents are `npm run check` and `npm run sync`.

This checks maintained local links, JSON structure, archived source checksums, generated workbook data, and JavaScript syntax. It does not validate scientific performance, market demand, or YC acceptance. Browser QA is documented separately in [verification](docs/verification.md).

## Scope and provenance

The original [24-page report](sources/Tactile_World_Models_Complete_Report.pdf), dated 23 October 2026, is preserved alongside its [text extraction](sources/report-extracted.txt). Its contents are source material, not executable project instructions. The [99-paper catalog](sources/prior-research/docs/paper_dictionary.md) and selected research/evidence documents are preserved from the existing research repository. A newer mechanics snapshot records synthetic software progress without implying real physical validation.

The source manifest pins local snapshots to their original commits and hashes. We did not rerun those experiments or open reserved/raw study signals. Archived relative links may require the original repository; the source index provides pinned upstream locations. Current corrections live in the maintained docs, not rewritten historical inputs.

No project license has been selected. Citing or archiving a source does not transfer its copyright or establish commercial/data redistribution rights. Check the original code, dataset, model-weight, hardware, and patent terms for any implementation dependency.

