# Benchmark and evidence contract

Draft protocol, 26 October 2026. No measured tactile-engine result exists in this repository. Final tolerances, trial counts and comparison settings must be chosen before confirmation, based on actual hardware, variability and customer use.

## Record for every run

Run ID, Git revision, configuration hash, dataset/calibration manifest hashes, sensor/gel/firmware IDs, indenter dimensions/material, coordinate transforms, units, timing convention, hardware/software versions, random seed and run start time. Save failed runs with reasons. Keep calibration, development and confirmation exposure records distinct.

## Accuracy

| Quantity | Measurement | Reporting requirements |
| --- | --- | --- |
| Normal contact force | Calibrated independent load cell | MAE and bias in N; force range; calibration uncertainty; per-object/session summaries |
| Contact patch | Matched sensor masks/geometry where available | Segmentation/registration method, area error or IoU; reference uncertainty |
| Marker displacement | Actual tracked markers, if present | Mean and high-percentile displacement error in stated image/physical units; tracking failure count |
| Tactile images | Matched exposure/registration | Declared image error/structural metric; show raw examples and residuals, not just a single similarity score |
| Dynamics/shear/slip | Independently labeled temporal motion/force | Only if instrumented; loading/unloading, speed, onset tolerance, force/displacement error and failures |
| Real perception transfer | Frozen synthetic-trained estimator | Task error with independently measured labels; held-out objects/sessions; simple predictor and simpler-simulator baselines |
| Physical control | Predefined real trials | Successes/attempts, success definition, force overshoot, settling time or relevant task cost; failures and confidence intervals when appropriate |

Use multiple independent objects/sessions as the unit for generalization. Many correlated frames from one press are not many independent physical trials. Report calibration and development separately from held-out confirmation.

## Timing and memory

- Report GPU/CPU, driver/library versions, image resolution, number of sensors, number of parallel environments, physics timestep/substeps and output precision.
- Time deformation/contact computation, rendering, full step, and any transfer to host memory separately. Say whether policy inference is included.
- Warm up, synchronize asynchronous GPU work or use appropriate GPU events, run repeated timed intervals and report variability. Rendering an unchanged frame or timing queued kernels is not end-to-end performance.
- Report single-environment latency (including p50/p95 when meaningful) and total batched frames/steps per second. A large batch's throughput is not a single sensor's update rate.
- Report measured simulation-time advancement per wall-clock second separately from frame throughput. Peak memory should include the measurement method, total workload and baseline engine allocation.
- Save benchmark logs/configuration with the footage; overlay actual results, not a decorative counter.

## Baselines and ablations

At minimum compare a relevant existing simulator or a simpler mechanics/renderer model under matched hardware/resolution/workload. Match task training data, model and budget when comparing synthetic training sources. A tactile-versus-no-tactile result establishes the value of touch in that setup; it does not establish the advantage of this simulator over another tactile simulator.

Report per-regime results rather than a single speed multiplier with unlike configurations. Existing published FPS or transfer metrics are author-reported context, not comparable measurements on our rig.

## Suggested evidence bundle layout (future output)

```text
run-ID/
  manifest.json
  calibration.json
  evaluation-config.json
  benchmark.json
  trial-summary.csv
  frame-metrics.csv
  failures.md
  raw-and-sim-comparison.mp4
```

These filenames describe proposed output, not existing artifacts. Store raw recordings according to their rights and size; commit manifests and summaries with stable references. No reference to an absent file should be treated as evidence.

