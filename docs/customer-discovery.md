# Customer discovery plan

Prepared 26 October 2026. Everything below is an experiment design. No customer conversations, commitments or outreach have been performed by creating this repo.

## Initial customer hypothesis

Start with robotics manipulation engineers who already own an optical tactile sensor, work in a simulator, and have a concrete contact task blocked by unreliable synthetic data or calibration. The user and buyer may differ: a research engineer may use the package while a lab lead or engineering manager controls budget.

| Segment | Job to investigate | Buying trigger to test | Main risk |
| --- | --- | --- | --- |
| Manipulation startup | Get a tactile-enabled task working on hardware | Recent deployment failure or upcoming milestone | Small team may prefer internal scripts |
| Industrial robotics R&D | Validate a specific contact process | Repeated commissioning/data-collection cost | Long integration and procurement cycle |
| Academic robotics lab | Produce reproducible experiments with limited hardware | Funded project with tactile evaluation | Interest may not imply software budget |
| Tactile sensor vendor | Help customers simulate and calibrate its sensor | Repeated customer integration requests | Could build internally or expect partnership economics |

Choose the first segment based on observed urgency and access. These are hypotheses, not verified segments with established willingness to pay.

## Questions for a first conversation

1. Walk me through the last contact-rich task you tried to deploy.
2. Which sensor, simulator, controller and data pipeline did you use?
3. What failed on hardware that your simulation did not predict?
4. Show a recent trace, issue or experiment if sharing is permitted.
5. What did you try to fix it, and how long did that take?
6. How much real data and hardware time did the fix require?
7. How do you decide that simulation is accurate enough for this task?
8. Which part of the workflow would you keep even if a better renderer appeared?
9. Who owns the problem, budget and purchase approval?
10. What deadline or outcome makes the problem urgent?
11. What have you already paid for, built internally or decided to live without?
12. What would have to be true for you to run an evaluation using your own task?

Listen before presenting the prototype. Ask about actual past behavior and artifacts. "Would you use this?" is weak evidence compared with a real integration attempt or a budgeted evaluation.

## Evidence record for each conversation

Record date; organization type; role; task; installed tools; recent failure; measured or estimated time/cost with attribution; current workaround; acceptance criterion; user; budget owner; procurement constraints; data-sharing permissions; agreed next step; and unresolved assumptions. Preserve exact quotations only with consent and clear attribution. Keep private names and commercial details out of public versions of the repo.

An observation is a report from a particular person. A repeated pattern requires independent observations; avoid counting several colleagues in one lab as independent buying organizations.

## Evaluation-to-pilot progression

| State | Evidence needed to use the label |
| --- | --- |
| Contact identified | A relevant organization or role is known |
| Interview completed | A dated conversation record exists |
| Problem confirmed | A recent concrete failure and workaround are documented |
| Evaluation agreed | Named owner, task, timeframe and input access are agreed |
| Evaluation running | Their engineer has run the package on the agreed task |
| Pilot accepted | Scope, acceptance metric, responsibilities and commercial terms are agreed |
| Paid pilot | Payment/invoice status is recorded accurately |
| Retained user | Meaningful repeated use over a defined period is recorded |

Do not collapse these states into "traction." Track stage transitions and elapsed time alongside counts.

## Small pilot proposal template

**Customer/task:** [organization and contact-rich task]. **Current workflow:** [tool and pain]. **Input:** [sensor calibration and permissioned contact recordings]. **Scope:** [one sensor, one scene, one evaluation]. **Acceptance criterion:** [pre-agreed error/transfer/integration target with baseline]. **Duration:** [agreed dates]. **Price:** [explicit proposal, not assumed revenue]. **Deliverables:** runnable package, calibration, comparison and failure report. **Exclusions:** unbuilt sensor support or unsupported transfer claims. **Decision:** who accepts/rejects and what follows.

The team should propose a measurable improvement and accept negative results. A pilot that only produces an attractive video does not test customer value.

## Suggested discovery gates

- At least one independent organization demonstrates a recent, specific problem in the proposed workflow.
- A user can identify how the current workaround consumes time, money or task performance.
- A budget owner or purchasing route is identified.
- A prospective user supplies or agrees to run a concrete evaluation with defined success criteria.
- Reasons for refusal are recorded and used to adjust the scope.

These are internal learning gates, not YC eligibility requirements or universal numerical thresholds.
