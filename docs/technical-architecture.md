# Proposed technical architecture

Prepared 26 October 2026. This is a design and validation plan, not a statement that these components are implemented. Current user-confirmed access: **a tactile sensor, no robot**; exact sensor, force reference, motion stage and calibrated dataset remain unconfirmed. The [industry map](industry-landscape.md) separates prior art from proposed differentiation.

## Product and research scope

The near-term product hypothesis is a calibrated tactile simulation module for a specific sensor/contact workflow. The long-term research objective is a physical contact representation that predicts observations and outcomes under actions across materials and sensors. Distributed whole-body somatosensation is a later integration goal.

Use precise terms:

| Component | Definition | Evidence needed |
| --- | --- | --- |
| Physics/contact model | Computes contact response and, when coupled to dynamics, physical state evolution | Independent force, deformation and motion measurements |
| Sensor renderer | Maps contact/deformation state into sensor observations | Matched real/sim images or signals on reserved conditions |
| Inference model | Estimates uncertain contact state or effective parameters from known probing actions and observations | Independent labels and identifiability tests |
| Learned world model | Predicts future state/observations from history and specified candidate actions | Action sensitivity and multi-step held-out rollouts |
| Controller/planner | Selects actions using feedback or predictions | Predefined real task trials and appropriate controls |

A static classifier or spectrum predictor is not automatically a sequential world model. Real feedback control with a synthetic-trained estimator is not automatically transfer of a simulation-trained policy.

## Separate the interfaces

```text
Object geometry + material/contact-pair parameters + sensor body
                         |
Known pose / velocity / action history
                         |
                CONTACT MODEL
      pressure / shear / deformation / slip + history
                  /                 \
                 /                   \
       SENSOR RESPONSE          DYNAMICS BACKEND
       image / taxels /         force / torque ->
       magnetic / vibration     next pose / velocity
                 \                   /
                  \                 /
                PREDICTED OBSERVATIONS
                         |
              INFERENCE / BELIEF UPDATE
                         |
                 PLANNER / CONTROLLER
```

This is a conceptual dependency diagram. It is not a running engine or a claim that all modalities are available. With prescribed-stage motion, kinematics are imposed: a matching force trace validates contact response under that motion, not freely evolving object dynamics.

## 1. Object and contact-pair description

Represent macro geometry, coordinate frames and surface region. Add microgeometry only when it changes measured residuals or the downstream task. Store effective friction/compliance/damping parameters with uncertainty and a validity range. Start with one rigid indenter and one pad; object deformation, adhesion, temperature and wear are optional future dimensions.

Friction belongs to the pair and conditions. Sensor elastomer compliance is distinct from object compliance. Geometry, rate, surface treatment and contact history can alter the response. A compact tactile asset is useful only if its predictions survive the advertised reuse.

Proposed record fields:

```json
{
  "schema_status": "proposed; not an established standard",
  "asset_id": "example-only",
  "geometry_ref": null,
  "contact_pair": {"object_surface": null, "pad_unit": null},
  "units": {"length": "m", "force": "N", "time": "s"},
  "model_family": null,
  "parameters": {},
  "parameter_uncertainty": {},
  "validity": {"load_N": null, "speed_m_s": null, "temperature_C": null},
  "calibration_recordings": [],
  "reserved_evaluation_recordings": [],
  "prediction_errors": {},
  "data_rights": null
}
```

Null means unknown. Example fields do not establish calibrated values or software support.

## 2. Contact mechanics and history

First fit a simple normal-force/indentation model appropriate to the measured pad geometry. Compare force curves and contact area on new depths and shapes. Track loading/unloading if hysteresis appears. A high-resolution discretization is justified only when its added fidelity is useful.

For a shear claim, add tangential displacement, history-dependent traction and stick/partial-slip/sliding behavior. Static geometry alone cannot recover history-dependent shear. [HydroShear](https://arxiv.org/abs/2603.00446) is a relevant existing approach to compare. A more detailed elastomer model such as [DiffTactile](https://arxiv.org/abs/2403.08716) can inform reference mechanics and parameter fitting.

Keep solver-specific numerical parameters separate from physical material properties. [Drake](https://drake.mit.edu/doxygen_cxx/group__hydroelastic__user__guide.html) documents that hydroelastic contact is not a deformable-state model. Validate geometry resolution and timestep; do not silently equate a hydroelastic modulus with an independently measured bulk modulus.

## 3. Sensor response

For the user's actual sensor, confirm accessible outputs, frame rate, timestamps, exposure, background drift, gel/skin identity and usable calibration interface. Optical sensors may expose RGB, inferred depth and marker motion. Other devices may expose magnetic readings or taxel fields. Do not assume GelSight-specific output until the sensor is identified.

The renderer receives physical contact/deformation state and returns the chosen sensor observation. Lighting/background and mechanical parameters need separate calibration bookkeeping. Include sensor response delay and observation noise when relevant to transfer. Real camera sampling rate, simulation timestep and rendering throughput are different quantities.

[Taxim](https://arxiv.org/abs/2109.04027) is a calibrated optical/marker precedent. [Isaac Lab](https://isaac-sim.github.io/IsaacLab/main/source/api/lab_contrib/isaaclab_contrib.sensors.html) already provides contributed camera/force-field interfaces. Reusing such a component must be attributed and distinguished from our contribution.

## 4. Inference and learned residual

Fit shared pad parameters on designated calibration records. Estimate per-contact-pair parameters using known probing actions; freeze them before evaluating reserved records. Compare physics only, data-driven only, and hybrid physics plus residual at matched data/compute budgets.

Use residuals to capture structured discrepancies rather than erase all physical constraints. Test new loads, speeds, locations, trajectories, sessions and specimens. A new sensor unit should receive explicitly counted sensor calibration; do not describe that as no-calibration transfer.

Report predictive uncertainty and validity bounds. A good fit to one trace can hide parameter ambiguity. Check multiple initializations, parameter sensitivity, and whether different fits predict the same reserved actions. A differentiable solver gives gradients; it does not resolve non-identifiability.

## 5. Dynamics coupling and developer interface

Initially keep prescribed-contact replay backend-independent. Later choose one dynamics engine to run physical state evolution. Assign responsibility for friction and compliance once, avoiding a custom contact force on top of already equivalent native forces. Record force conventions, frames, integration timestep and contact thresholds.

The first API should expose scene/config loading, reset, prescribed action/pose stepping and structured observation/contact outputs. A later environment wrapper can add task reward, termination and batching. The apparent simplicity of a five-line example must not hide required calibration or pretend an unfinished library exists.

Proposed interface, for design discussion only:

```python
# Design sketch. No tactile_world simulation package is implemented in this prep repo.
sim = SensorTwin.load(sensor_config, contact_model)
state = sim.reset(scene)
result = sim.step(commanded_pose, dt=dt)
# result: tactile observation, contact state, diagnostics, provenance
```

Implement one backend and document the boundary. ROS 2, full UI, multi-sensor support and a new rigid-body solver are optional extensions driven by user needs.

## 6. Measurements before model scale

The physical rig should log timestamped observations, measured displacement, independent normal force and setup identity. Add independent tangential-force measurement before claiming shear-force accuracy. A camera recording object motion can help confirm gross sliding; marker tracking alone is a sensor-derived proxy and must be labeled.

Predefine calibration/evaluation splits by whole recording, object/specimen and session. Random neighboring video frames are correlated and unsuitable as the only split. Save units, geometry, sensor identity, data hashes, coordinate conventions, synchronization checks, repetitions and excluded-trial reasons.

The existing sibling vibration project provides provenance and evaluation practice, not calibrated force data. Its saved results describe development specimens and logged-time coordinates. Preserve its reserved specimens and do not relabel band powers as physical force, motion or optical rendering evidence.

## Verification gates

| Gate | Required artifact | Claim it supports | What it does not establish |
| --- | --- | --- | --- |
| Measurement | Repeatable press/release recordings with independent force/displacement | Our bench observations are usable | Simulator fidelity |
| Contact | Frozen model predicts reserved contact response | Restricted force/contact prediction | Free-body motion or arbitrary materials |
| Sensor | Same recorded motion produces comparable real/sim outputs | Restricted sensor response fidelity | Correct friction or task utility |
| Performance | GPU-synchronized timing with resolution, batch, memory and workload | Stated throughput/latency | Real sensor rate or universal speed |
| Perception transfer | Frozen synthetic-trained estimator tested on new real recordings | Real usefulness of generated data for that task | Simulation-trained policy transfer |
| Feedback control | One-axis controller using tactile feedback, independently measured error | Real feedback behavior | Zero-shot learned policy transfer unless trained/frozen accordingly |
| Dynamics | Unforced body motion and force predictions over multiple steps | Action-conditioned physical rollout | Whole-body generalization |
| Policy transfer | Frozen sim-trained policy; recorded deployment adjustments; predefined real trials | Transfer for the specified setup | General transfer across untested robots/tasks |

## Recommended near-term experiment

Use a fixed tactile pad, repeatable normal indenter, position measurement and independent load cell. Calibrate a small contact/sensor model on designated records. Compare force and tactile response on reserved shapes/trajectories, then train a force estimator on synthetic observations and evaluate it on the real sensor. Compare against a simple calibrated contact-area/feature baseline.

If time and hardware allow, motorize one axis and maintain a target force using the estimator; keep the load cell outside the controller's feedback and use it to measure actual tracking error. This yields a comprehensible real-world artifact before robot integration. A manual rig can still support repeatability, calibration and perception transfer; it cannot demonstrate autonomous physical control.

The exact task should change if the available sensor or thesis is shear-focused. Then prioritize controlled lateral displacement, independent tangential force and slip confirmation. A first-stage result that exposes a limitation is useful; it should change the model or claim rather than be hidden by a more elaborate video.

## Later research, conditional on the gates

1. Reuse across specimens and sensor units with explicit recalibration cost.
2. Independently moving-body dynamics and one tactile-dependent task.
3. Multiple sensor renderers driven by shared contact state.
4. Material assets with reproducible protocols and customer reuse evidence.
5. Whole-hand/body observation models at heterogeneous resolutions.
6. High-frequency vibration, thermal response and wear where data and use cases justify them.

These are sequential ambitions, not required YC application prerequisites. Commercial relevance still requires users to demonstrate recurring pain, adoption and willingness to pay.

## Compact glossary

| Term | Meaning here |
| --- | --- |
| SDF | Signed distance field describing distance and inside/outside relation to a surface |
| Taxel | A local tactile sensing element |
| Normal force / pressure | Force perpendicular to contact; pressure is force per area |
| Shear traction | Tangential force per area across contact |
| Incipient slip | Local partial slipping before gross object sliding |
| Compliance | Deformation response under loading, dependent on material and geometry |
| Viscoelasticity | Response depending on rate and history, including elastic storage and dissipation |
| Hydroelastic contact | Approximate contact surface/pressure calculation; not automatically full deformation dynamics |
| FEM / MPM | Finite-element / material-point numerical methods for continuum mechanics |
| Inverse physics | Fitting model parameters from measured interactions |
| Latent state | A learned compressed representation; physical meaning requires validation |
| Sim-to-real | Evaluation of a simulation-trained model or policy on physical measurements/hardware |
| Provenance | Traceable measurement, calibration, specimen, processing and source identities |
