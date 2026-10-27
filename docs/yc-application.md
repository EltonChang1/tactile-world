# YC application working draft

Prepared 26 October 2026. This is an internal evidence worksheet, not an application submission. Bracketed fields require founder input. Draft product descriptions describe an intention unless linked evidence establishes the capability.

## Timing and submission

YC's application page currently lists Winter 2027 and an on-time deadline of **2 November 2026, 8:00 p.m. Pacific Time**, with decisions by 11 December for on-time applicants. Recheck the live form before submitting; the founders have not confirmed a target batch. [Official application page, checked 26 October 2026](https://www.ycombinator.com/apply).

Apply with the truthful state of the company. A robot transfer result, revenue or a finished product is not an eligibility gate: YC explicitly considers idea-stage companies. [YC FAQ](https://www.ycombinator.com/faq).

## One-sentence description

**Working direction:** "We are building software that simulates touch so robotics teams can train and test tactile models before collecting every example on hardware."

**Narrower candidate after customer discovery:** "We help robotics teams calibrate tactile simulation against their real sensor and generate training data for contact-rich tasks."

Choose one description that fits the first buyer and current product. Avoid implying a universal material model, validated physics engine, established force accuracy or robot deployment.

## What are you building?

Draft: "Our first prototype will reproduce controlled contact on one tactile sensor and compare simulated images and contact forces with independent real measurements. We then plan to test whether models trained on the synthetic data work on real contacts reserved from calibration."

Evidence needed: exact sensor model, sample experiment, runnable simulator, calibration boundary, benchmark report and synthetic-to-real evaluation. Replace future tense only after these exist.

## Who needs it and what do they do today?

**Customer hypothesis:** small robotics manipulation teams already using optical tactile sensors and an existing simulator. They may spend engineering time calibrating sensor behavior, collecting real contact data and debugging policies that fail after deployment.

**Alternatives:** collect real data; customize open-source tactile simulation; extend Isaac/MuJoCo/Drake or an internal engine; use force control or vision without tactile simulation; postpone the task. The pain, urgency and budget are unvalidated here.

Complete: "[Named user role] lost [measured time/cost] during [recent task]. They used [specific tool], which failed because [specific limitation]. [Evidence reference/date]."

## How far along are you?

Confirmed in this conversation: **access to one tactile sensor, no robot**. Sensor model, controlled motion hardware, force reference and current simulator status remain unknown.

The sibling tactile-contact-research repository documents offline brief-touch vibration-spectrum prediction and saved development comparisons. The newer brief-touch-mechanics README, updated 12 October 2026, documents ingestion, eight force methods/controls, a synthetic force pipeline and analytical motion calculations. It explicitly reports no physical collection or real force benchmark; its toy generator encodes friction in vibration amplitude, and the simple force-only method beats its tactile methods. These are related software foundations, not a validated tactile physics product. See [current evidence](current-state.md) and the [archived mechanics README](../sources/prior-mechanics/README.md).

Complete a dated progress statement: "Since [date], [founder] built [artifact/link]. It was tested on [evaluation definition] and produced [measured result]. Our next falsifiable milestone is [experiment] by [target date]."

Do not copy the illustrative claims "500+ FPS", "trained in under an hour", "three beta labs" or "zero-shot transfer" into the application without corresponding evidence.

## Why this approach? What is the insight?

**Technical hypothesis:** separating material/contact mechanics from the sensor's optical response may improve transfer across actions or reduce recalibration effort compared with a sensor-output predictor alone.

**Commercial hypothesis:** a calibrated, reproducible workflow may be more valuable to a buyer than a visually convincing renderer. Both hypotheses need controlled comparisons and user evidence. Existing tactile simulators and world models already address parts of this problem; read the [industry landscape](industry-landscape.md).

Suggested answer frame: observation from actual work → mechanism that explains it → experiment or customer behavior supporting it → remaining uncertainty. Avoid "nobody else understands touch."

## Why now?

Candidate argument: robotics teams can combine tactile hardware, GPU simulation and learned sensor representations, but the remaining bottleneck may be reliable calibration and task-specific transfer. Cite the relevant current systems in the landscape and show a recent workflow change from a real prospective buyer. Technology availability alone does not establish demand.

## Competition and defensibility

Name direct tactile simulators, world-model research, general simulation platforms, sensor vendors and the customer's internal scripts. Explain one measured limitation your initial workflow addresses. The simulator is a proposed entry point; it is not yet evidence of a durable moat.

Candidate durable assets to test: permissioned contact datasets with known provenance, repeatable calibration/evaluation protocols, validated sensor/material packages, integration depth and retained workflow usage. None is an existing moat in this repo.

## Team and commitment: complete before submission

| Field | Required factual answer | Current state |
| --- | --- | --- |
| Founders | Names, roles, relevant contributions and ownership of artifacts | Unknown |
| Relationship | How founders met; dates and work shipped together | Unknown |
| Technical ownership | Who implements mechanics, rendering, measurement and learning | Unknown |
| Customer ownership | Who interviews users and runs pilots | Unknown |
| Commitment | Start dates; part-time/full-time status; constraints | Unknown |
| Equity | Actual percentages, option pool, commitments and rationale | Unknown |
| Credentials | Exact degrees, roles and affiliations with supporting records | Unknown |
| IP/data rights | Who owns code and data; applicable institutional obligations | Unknown |

Describe individual contributions precisely. A collaborator or advisor is not automatically a cofounder. Do not imply a PhD, university affiliation, partnership or full-time status that has not been confirmed.

## Metrics, business and funding facts

Complete actual revenue, active organizations, repeated usage, interviews, pilots, cash, monthly net burn, runway and committed funding. **Unknown is different from zero.** Use definitions and dates; a supportive conversation is not an active pilot and a letter of intent is not revenue. See [business model worksheet](business-model.md).

## Founder video and product demo

Prepare two distinct artifacts. The founder video follows YC's one-minute, founders-speaking guidance and should use talking points rather than a recited script. The product demo shows the working artifact; use the live form's duration and hosting instructions. [Official video guidance](https://www.ycombinator.com/video).

## Submission review

- [ ] Confirm target batch and current form instructions.
- [ ] Replace every bracketed field with a verified fact or remove it.
- [ ] Link major progress claims to artifacts and dates.
- [ ] Distinguish prior research, current implementation and future work.
- [ ] Reconcile founder roles, commitment, equity, metrics and funding answers.
- [ ] Verify demo access from a signed-out browser and check audio.
- [ ] Have every founder review the final application and its claims.
- [ ] Submit intentionally; this repo does not submit or contact YC.

The useful four-part review lens is clarity, velocity, domain insight and founder collaboration. It is our preparation framework, not an official exhaustive YC rubric.
