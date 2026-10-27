# Current state and permitted claims

Reviewed 26 October 2026. This preparation review inspected documentation and Git state; it did not execute the scientific experiments or inspect reserved/raw recordings.

## User-confirmed hardware

The user confirmed **a tactile sensor, but no robot** in this conversation. The sensor model, camera/frame interface, markers, firmware, calibration, force capacity, and available motion rig have not been confirmed. Do not assume it is a GelSight Mini or that it exposes a force/depth API.

## Existing evidence

| Work | What the inspected documentation establishes | Scope and limits |
| --- | --- | --- |
| `tactile-contact-research`, commit `49ea671ad759a18599dfdaf9255abf9631937881` | Offline brief-touch vibration-spectrum prediction, five simple baselines, a small encoder, provenance and saved computational validation | 96 log-band-power targets; not an optical renderer, sequential dynamics model, force law, or robot-control result |
| Matched vibration comparison, 10 October 2026 | Retrieval outperforms the current encoder in the reported development comparisons | Ten training specimens and two repeatedly exposed evaluation specimens; no fresh confirmation; clock convention remains logged coordinates |
| Saved vibration validation | The report records 110 passing tests and exact reconstruction/replay checks | Attributed to the archived report; not rerun in this repository |
| `brief-touch-mechanics`, commit `e04f1cc975bb6540285096f9d3f257fefe1e0e43`, README updated 12 October | CSV ingestion with calibration/provenance, eight force methods/controls, whole-group holdouts, synthetic force pipeline and analytical motion calculations | Physical collection has not started. The planned collection schedule is not collected data. No real force, free-motion, or control result |
| Saved mechanics software exercise | 450 generated trials, 10 synthetic held-out groups, 160 query trials; saved 16 automated tests | Toy generator deliberately encodes friction in vibration amplitude. The simple force-only B1 method beats both tactile methods. Synthetic scores cannot establish real-world tactile benefit |
| Mechanics real-data access audit | Nine HaTT files from three surface folders were inspected for access/schema in the earlier project | Timing, calibration, force conventions, independent trials and verified sliding remain unresolved; no HaTT force benchmark scored |
| Supplied 23 October report | A broad literature synthesis and proposed architecture | Not evidence that this team implemented the described system or that a commercially valuable gap is established |

Source snapshots: [vibration README](../sources/prior-research/README.md), [research audit](../sources/prior-research/docs/repository_research_audit.md), [matched results](../sources/prior-research/docs/matched_development_review.md), [saved validation](../sources/prior-research/docs/matched_validation_review.md), [current mechanics README](../sources/prior-mechanics/README.md). The 11 October audit's statement that mechanics implementation is still pending is superseded by the 12 October mechanics README for **software progress only**.

## Claims we can draft today

> We are developing tactile simulation tools for robot-learning teams. We have built offline tactile prediction and synthetic force-evaluation pipelines. Our next milestone is validating a single sensor's simulated contact against synchronized physical measurements.

This is a proposed company description, not validated positioning. Attribute any numerical development results and retain their qualifiers. Describe the intended product in future tense where it is not built.

## Claims requiring new evidence

- Accurate real contact-force prediction and optical/marker reproduction on held-out contacts.
- A measured speed/accuracy advantage over a relevant baseline under the same configuration.
- A working tactile `reset/step` API and integration into a real customer workflow.
- A model trained on synthetic contacts that generalizes to real sensor data.
- A real closed-loop task; zero-shot robot policy transfer is a separate, later result.
- Customer pilots, active users, willingness to pay, revenue, pricing, retention and a defensible market size.
- Any team degree, affiliation, founder employment/full-time duration, equity allocation, or co-founder history.

## First decisions to resolve

1. Identify the sensor and verify its output, real frame rate, calibration instructions and safe operating limits.
2. Confirm a fixed mount, measured translation, normal-force instrumentation and data logging access.
3. Choose whether the first buyer needs calibrated synthetic images, force/shear prediction, or faster repeatable tactile evaluation. Validate the workflow with users before broadening the product.
4. Set the application target batch/date from the live form. A complete physical-AI product is not a prerequisite to applying.

