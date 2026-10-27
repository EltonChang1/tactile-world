# PoC build plan: a tactile sensor, no robot

Planning date: 26 October 2026. All physical milestones below are **planned**, not completed. The existing evidence is documented in [current state](current-state.md).

## First demonstration

Build a calibrated benchtop tactile digital twin: repeat a measured press-and-release contact, reproduce it in simulation, and evaluate a model trained on synthetic images against independent real measurements. A motorized stage can later close the loop. Start with normal contact; add sliding when the supported mechanics and instrumentation justify it.

Choose one immediate customer workflow, such as generating labeled data for a particular optical sensor or evaluating force-estimation models. The workflow and willingness to pay remain hypotheses.

## Dependency order and acceptance evidence

| Gate | Build | Minimum acceptance evidence | Dependency |
| --- | --- | --- | --- |
| G0 | Inventory sensor/interface and rig access | Model, output format, observed frame timestamps, firmware/calibration notes; confirmed mounting and force/displacement instrumentation | None |
| G1 | Fixed sensor mount and repeatable translation | Repeatable normal approach/contact/release, measured object dimensions and relative displacement; independently calibrated normal-force measurement for force claims | G0 |
| G2 | Synchronized acquisition | Raw frames, force, displacement, timestamps, coordinate frames, units, sensor/specimen IDs, calibration version and acquisition metadata | G1 |
| G3 | Contact model plus separate sensor renderer | Correct output shapes and physically consistent force/deformation behavior on a simple indenter; documented approximation and operating range | G2 |
| G4 | Calibration and frozen held-out evaluation | Calibration fits separated from evaluation by object/session/trajectory; reserved test object and paths; fixed parameters and baseline before scoring | G3 |
| G5 | Matched accuracy/speed benchmark and replay viewer | Sim/real recordings driven by the same measured motion, physical/image metrics, baseline, failures and timed configuration | G4 |
| G6 | Runnable Python interface and reproducible examples | Fresh process can load configuration, reset, step motion, retrieve frames/contact state, replay evaluation and run benchmark | G3, G5 |
| G7 | Synthetic-trained perception transfer | Frozen model tested on reserved real recordings; independent ground truth; matched simpler-simulator and simple predictor baselines | G4, G6 |
| G8 | Optional one-axis physical feedback | Motorized stage uses tactile estimate to regulate target force; independent load cell only evaluates performance; predefined repeated trials | G7 |
| G9 | Optional robot policy transfer | Actual robot access, policy frozen after simulation training, matching deployable observations and action interface, reported calibration/adaptation and repeated physical trials | Separate hardware/control program |

**Filmable technical minimum:** G0-G6 with clear scope. **Recommended next proof:** G7. G8 and G9 are stretch gates, not prerequisites imposed by YC. Dates and numerical pass margins must be filled after inspecting hardware and baseline variability; they are not promises.

## Hardware and software to obtain

- Existing tactile sensor and host interface; rigid adjustable mount; lighting/exposure controls where supported.
- One measured translation axis (manual screw slide is sufficient for acquisition); known sphere/cylinder/blunt-edge indenters. A more intricate object can be reserved for a later visual example.
- Normal load cell, acquisition electronics and independent calibration procedure if predicting normal force. Add suitable tangential force measurement and a lateral axis before quantitative shear/friction claims.
- External camera for the physical overview. It is documentation rather than ground truth for internal gel deformation.
- Logger, immutable acquisition manifests, sensor/contact configuration, contact solver, optical observation model, replay tool, benchmark runner and training/evaluation script.

Use the manufacturer's actual gel load/indentation and interface limits. Do not set a numerical force/depth target until the device is identified. Record observations at the real hardware rate; faster simulator throughput does not raise the physical sensor rate.

## Suggested first learning task

Train a **normal-force estimator from tactile images**, using the independent normal load cell for real evaluation. This is appropriate only if the sensor interface and contact observability support it. Generate varied simulated loads, object geometries and nuisance parameters, freeze model weights, and evaluate on held-out real object/session combinations.

Include a simple contact-area/indentation baseline and the same estimator trained from a simpler simulator under a matched budget. Log real calibration data used by the simulator; synthetic training does not imply zero real calibration. If a simple predictor works equally well, report that finding and reconsider the first differentiator.

This supports **perception transfer**. A PID controller driven by this estimator can add feedback control, but is not evidence of a learned policy transferred zero-shot. An actual policy-transfer claim requires a frozen learned controller and its own trials.

## Experimental controls

Keep calibration recordings separate from evaluation recordings; reserve whole objects or sessions when claiming those forms of transfer. Freeze evaluation choices before opening final recordings. Do not tune to a visually impressive test object and then call it unseen. Include loading and unloading; include multiple speeds if claiming dynamics, and lateral slip tests only if modeled and independently labeled.

The [benchmark contract](benchmark-contract.md) defines metrics, timing and evidence artifacts. The [demo storyboard](demo-storyboard.md) maps claims to footage.

## Stop/go decisions

- No calibrated force labels: demonstrate measured motion/image agreement, and leave force accuracy unproven.
- Optical agreement with poor physical force/marker agreement: improve contact modeling or narrow the claim to the renderer.
- Good fit only on calibration objects: address generalization before broad material-transfer claims.
- Baseline matches the proposed engine: investigate whether calibration time, usability or a different contact regime is a valuable, measurable advantage.
- No buyer workflow/pain: revise the product hypothesis alongside the technical work.
- Physical validation unfinished at submission: show actual software and clear next gates; do not substitute synthetic data for real proof.

