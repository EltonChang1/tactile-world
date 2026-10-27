# Interview preparation: know the work, keep the conversation natural

Prepared 26 October 2026. Use this as a facts-and-evidence worksheet. The interactive question bank is in [data/questions.json](../data/questions.json).

YC describes a ten-minute conversation with all founders present. Its guidance favors spontaneous discussion, progress and a ready working demo; it discourages extensive rehearsal. Keep key metrics available in a small fact sheet. [Official interview guide](https://www.ycombinator.com/interviews).

## Our communication habits

Answer the question directly, add the most relevant evidence, then stop and let the partner steer. A brief initial answer is useful; a strict sentence cap is unnecessary when a technical follow-up needs detail. Say when something is unknown, preliminary or a hypothesis.

Let the person who knows the topic best answer. Use a short handoff when helpful. Agree on responsibilities beforehand and avoid talking over one another. Resolve material factual disagreements before the call; correct a consequential mistake plainly if it occurs. There is no official CEO-first or 70% speaking rule in the reviewed guidance.

## One-page fact sheet to keep nearby

| Topic | Write the real value and reference |
| --- | --- |
| Product | One plain sentence and working demo command |
| Progress | Three dated artifacts and what each establishes |
| Hardware | Sensor model, force reference, controlled motion and access constraints |
| Main result | Metric, units, held-out condition, sample size and baseline |
| Remaining risk | Current strongest uncertainty and next experiment |
| Users | Actual users/interviews/pilots; definitions and dates |
| Business | Pricing hypothesis or accepted price; buyer and alternatives |
| Finances | Cash, net burn, runway method and funding status |
| Founders | Roles, ownership, commitment, equity and history together |
| Since application | New result or learning, with a dated artifact |

## Three objections to reason through

**Why won't NVIDIA add this?** Frame: "Platforms already support important contact and simulation capabilities. We are testing whether [specific calibration/data/transfer workflow] solves [measured customer bottleneck] better than the available workflow; our current evidence is [artifact], and platform integration is [implemented/planned]." Follow-up: why would a team pay separately, and what would remain useful if the platform improved tomorrow?

**How do you know realistic images mean useful physics?** Frame: "We evaluate image agreement separately from [independent force/marker/trajectory measurements]. The current prototype establishes [exact result]; [dynamics or policy transfer] remains unproven." Follow-up: how were calibration, evaluation and model selection separated?

**Can this become a large business?** Frame: "Our first customer hypothesis is [narrow segment] paying for [specific job]. We are counting reachable buying organizations and testing budgets before asserting market size; expansion to [adjacent workflow] depends on [evidence]." Follow-up: how much revenue can the initial segment support without assuming every robot needs a seat?

## Technical facts to understand, not memorize as a performance

- What the model receives, predicts and cannot observe.
- Which real data calibrates the simulator versus trains or evaluates the downstream model.
- The independent force/position reference and its calibration uncertainty.
- Contact model, numerical assumptions, optical model and known failure modes.
- Single-scene latency versus aggregate GPU throughput, and timing boundaries.
- Which baseline tests the value of this engine, rather than the general value of touch.
- Why a learned vibration spectrum is not a physical state transition or a validated friction estimate.
- What "zero-shot" means for the specific weights, sensor calibration and deployment changes.

## Team worksheet

Each founder should independently describe the customer, current result and remaining risk, then compare answers for factual consistency. Discuss one real example of resolving a hard decision together. Do not invent a conflict story, ship date, role, degree or division of responsibilities.

## Practical readiness

- [ ] Working demo is already loaded; saved clip is available if hardware fails.
- [ ] Every founder can explain their own contribution and the team's open questions.
- [ ] Facts and artifact links are nearby; numerical definitions agree.
- [ ] Camera, audio, screen sharing and network work.
- [ ] A concise progress update since application exists if there has been progress.
- [ ] Time is being spent building and understanding users, rather than polishing canned answers.
