# Product demo: one real contact, one simulated contact, one useful model

Prepared 26 October 2026. Current hardware fact: tactile sensor access, no robot. All experiment scenes below are proposed until measured artifacts exist.

## What to prove first

Target: reproduce normal indentation on one sensor, validate contact mechanics independently, and test a model trained on simulated data against real contacts reserved from calibration. Use a mounted sensor, measured translation stage, known indenter geometry and a calibrated normal-force reference. Confirm actual hardware availability first.

The benchtop model can be useful without a robot. It does not establish general material identification, manipulation transfer or a complete physical world model.

## Record two separate videos

The **founder video** follows YC's one-minute guidance: founders talking, all founders included, using talking points rather than reciting a script. The **product demo** shows the working system. Check the live application for its demo duration and submission requirements; the following 60-second sequence is our editorial proposal. [Official founder-video instructions](https://www.ycombinator.com/video).

## Proposed product sequence

| Time | Visual | Explain | Required evidence |
| --- | --- | --- | --- |
| 0:00-0:08 | Real sensor, rig and indenter in contact | Who the software helps and what workflow it addresses | Actual working rig; accurate sensor label |
| 0:08-0:25 | Real tactile frame beside simulation driven by measured motion | This is the same geometry and motion; state calibration scope | Time-aligned recordings; frozen parameters; reserved trajectory/object |
| 0:25-0:40 | Sim-trained estimator predicts real normal force; reference force plotted beside it | Synthetic training data is useful on this specified real evaluation | Frozen weights; separate real evaluation; error in N; independent load cell |
| 0:40-0:50 | Benchmark command and terminal result | Full-step speed under explicit settings | GPU/CPU, resolution, batch size, timing boundary, latency and memory |
| 0:50-1:00 | Runnable Python example and result, or optional stage control | How a developer uses the package | Real executable example; actual dependency and calibration setup |

Start with the system running. Use clear speech and readable text. Keep edits simple and label any playback acceleration. A saved replay is valid if labeled as a recorded experiment; do not present it as live inference. Avoid a manufactured "call to action" or an unsupported adoption claim.

## Minimum and stretch versions

**Minimum:** real contact sequence, matched simulation, held-out physical/image error, honest speed result and runnable example. Describe this as a calibrated simulation prototype.

**Recommended addition:** synthetic-trained normal-force estimator with an independently measured real error and a simple baseline. If a force reference is unavailable, choose a target with trustworthy labels, such as controlled edge position; state the narrower claim.

**Stretch:** a motorized one-axis stage uses the tactile estimator to regulate contact force while the load cell independently scores performance. Keep the load cell out of the controller's inputs. This establishes perception transfer plus feedback control. To establish policy transfer, train/freeze the policy in simulation, state what calibration occurred, and evaluate predefined real trials.

For a shear-focused invention, add lateral motion, measured tangential loading, marker tracking where supported, and press-drag-slip-release sequences. A normal indenter cannot establish shear/slip fidelity.

## Shot checklist

- [ ] Sensor, indenter and movement are visible in an external view.
- [ ] Camera/force/position clocks and synchronization are checked.
- [ ] Simulator receives measured motion, not force reference labels used to fabricate agreement.
- [ ] Calibration, selection and reserved evaluation recordings are identified.
- [ ] Predicted and measured units, scales, timestamps and sample counts are readable.
- [ ] A geometry or motion reserved from calibration is included without retuning.
- [ ] The baseline and any failed trials appear in the accompanying report.
- [ ] The throughput overlay comes from the measured execution path.
- [ ] Hardware, resolution, batch size and render-versus-full-step timing are stated.
- [ ] Numerical simulation frequency is distinct from sensor frame rate and controller update rate.
- [ ] Source revision, configuration, dataset manifest and model weights identify the run.
- [ ] Spoken claims match current evidence; no fictional 500 FPS, labs or zero-shot success.
- [ ] Final link works for a reviewer without requesting access; live-form hosting rules are followed.

## Fill-in narration after the evidence exists

"We are building [plain product] for [specific user]. Here is [sensor] contacting [object]; this simulation uses the measured motion and parameters calibrated on [separate recordings]. On [reserved evaluation], [model trained on synthetic data] achieves [metric] compared with [baseline]. The full simulation runs at [measured speed/settings], and this script reproduces the result."

This is a template for factual narration, not a script to recite for the founder video.
