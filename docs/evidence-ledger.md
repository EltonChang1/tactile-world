# Evidence ledger

Baseline review: 26 October 2026. This file controls application claims. Checklists and slides summarize it; they do not replace supporting artifacts. Source snapshots are pinned in [the manifest](../sources/manifest.json).

## Status vocabulary

- **Confirmed:** directly stated by the user or established by an inspectable artifact for the named scope.
- **Saved result:** reported in a preserved prior experiment/document; not rerun in this preparation repository.
- **Published claim:** attributed to an external primary source, not reproduced by this team.
- **Hypothesis:** proposed technical/business claim awaiting a test.
- **Planned:** intended work, with no result yet.
- **Unknown:** facts still needed from the founders, instruments, or customers.

## Current records

| ID | Claim | Status / date | Source | Allowed scope and implication |
| --- | --- | --- | --- | --- |
| E01 | A tactile sensor is available; no robot is available | Confirmed by user, 26 Oct | Conversation; [current state](current-state.md) | Sensor identity, rig, load cell and output interface remain unknown |
| E02 | Offline support-conditioned vibration-spectrum software exists | Saved implementation/documentation, reviewed 26 Oct | [Pinned research README](../sources/prior-research/README.md) and [audit](../sources/prior-research/docs/repository_research_audit.md) | An observation-prediction component; not a complete physics engine |
| E03 | Retrieval beats current encoder on the reported matched development comparison | Saved result, 10 Oct | [Matched review](../sources/prior-research/docs/matched_development_review.md) | Ten training and two repeatedly exposed evaluation specimens; logged-time convention; no confirmed generalization superiority |
| E04 | Prior vibration software validation reports 110 passing tests | Saved result, 10 Oct | [Validation](../sources/prior-research/docs/matched_validation_review.md) | Computational validation of prior artifacts; not rerun here and not physical validation |
| E05 | Force ingestion, eight methods and a synthetic mechanics pipeline exist | Saved implementation/documentation, 12 Oct | [Mechanics README](../sources/prior-mechanics/README.md) | Physical collection has not started; supersedes the older audit's no-implementation statement for software only |
| E06 | Mechanics toy exercise has 450 generated trials and saved 16 automated tests | Saved result, 12 Oct | [Mechanics execution report](../sources/prior-mechanics/docs/execution-report.md) | Toy generator encodes friction in vibration; force-only B1 is strongest among the compared short-observation methods; no real force accuracy established |
| E07 | Hybrid mechanics plus calibrated sensor response improves real transfer | Hypothesis | [Architecture](technical-architecture.md) | Requires matched baseline, held-out physical labels and downstream evaluation |
| E08 | Benchtop simulated/real contact agreement | Planned | [PoC plan](poc-build-plan.md) | Need calibrated synchronized measurements, frozen evaluation and physical/image errors |
| E09 | 500+ FPS, 1000 Hz, low memory or training within one hour | Unknown / unmeasured | [Benchmark contract](benchmark-contract.md) | No number may appear as an achieved result until measured with full configuration |
| E10 | Synthetic-trained perception transfer | Planned | [PoC plan G7](poc-build-plan.md) | Distinguish real simulator calibration from real model-training data; freeze before evaluation |
| E11 | Physical feedback or zero-shot robot policy transfer | Planned | [PoC plan G8/G9](poc-build-plan.md) | An estimator plus PID is not learned-policy transfer; actual robot access absent |
| E12 | Customer pain, pilots, revenue and willingness to pay | Unknown | [Discovery plan](customer-discovery.md) | Do not claim beta labs, contracts or paying users from proposed interview targets |
| E13 | Founder biographies, equity, employment dates, finances and pricing | Unknown | [Application worksheet](yc-application.md) | Founders must supply these accurately; placeholders are not facts |
| E14 | Current landscape includes tactile renderers, mechanics models and action-conditioned world models | Published claims, checked 26 Oct | [Industry landscape](industry-landscape.md), [structured catalog](../data/industry.json) | Source-specific capabilities and author-reported metrics; no universal absence or superiority claim |

## Add a record when something changes

Include ID, owner, date, exact claim, status, artifact path/URL, dataset and calibration provenance, units/denominator, comparison, limitations, and the application sentence this evidence permits. If the source changes, retain the historical entry and add a superseding one. Conflicting evidence is useful; do not delete a baseline win or a failed physical run.

For a customer claim, identify whether it is an interview, requested test, accepted pilot, signed agreement, deployment, active usage, invoice or received payment. Each is a different state. Keep private interview details out of shareable deck exports.

