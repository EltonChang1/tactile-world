# Tactile World: industry and research landscape

Research checked **26 October 2026**, America/Los_Angeles. This is a curated decision map, not an exhaustive market census or a benchmark run. Paper results are author-reported within their original experimental settings. A primary-source check establishes what a source says; it does not independently reproduce the result. The machine-readable companion is [industry.json](../data/industry.json).

## What is already real

Tactile image simulation, soft-contact modeling, tactile representations, and predictive tactile world models all have substantial prior art. TACTO describes high-resolution optical tactile rendering at hundreds of frames per second; TacSL combines accelerated tactile simulation with learning and transfer. Therefore, rendering a plausible image quickly is a useful engineering milestone, but not a sufficient differentiation claim. [TACTO](https://arxiv.org/abs/2012.08456), [TacSL](https://arxiv.org/abs/2408.06506).

HydroShear explicitly models history-dependent shear and stick-slip, with author-reported zero-shot robot transfer. It is a particularly close technical comparison for a startup claiming fast, physically useful tactile simulation. Its evaluation is not a measurement of our engine. [HydroShear](https://arxiv.org/abs/2603.00446).

The broad opportunity proposed in the supplied report is to connect measured material properties, calibrated contact prediction, sensor-specific observations, and useful learning workflows. That is an architecture and business hypothesis. Neither a literature gap nor an attractive demo establishes customer demand, general material transfer, or a durable moat.

## How to classify the ecosystem

- **Direct technical alternative:** could supply the tactile simulation or calibration function a prospective customer would otherwise buy from us. Research software can be an alternative even without a commercial company behind it.
- **Platform and potential substitute:** the simulator/framework a customer already uses, including its built-in tactile support. A platform can also become an integration partner.
- **Complement:** sensor hardware, datasets, encoders, and numerical infrastructure that may accelerate our system.
- **Adjacent research:** learned dynamics or task policies that overlap our long-term ambition. They can also substitute for simulation in a narrow customer workflow.
- **Operational substitute:** collect real data, use a simple force controller, avoid a tactile sensor, or build a small internal model. Customer interviews must compare these options too.

These categories describe relationships to the proposed product; they are not claims about organizations' commercial intentions.

## Simulation and contact modeling

| System | What the checked source establishes | Important boundary | Implication for Tactile World |
| --- | --- | --- | --- |
| [TACTO](https://arxiv.org/abs/2012.08456) | Configurable optical tactile rendering, including DIGIT and OmniTact; perceptual/control demonstrations | Optical realism does not establish arbitrary soft-material dynamics. The original repository is archived | Reproduce the relevant rendering baseline before making a speed/quality claim |
| [Taxim](https://arxiv.org/abs/2109.04027) | Example-based GelSight optical response and marker-motion simulation with real calibration | Calibration and sensor assumptions matter; not a universal material asset format | Compare calibration effort and held-out marker/image error |
| [TacSL](https://arxiv.org/abs/2408.06506) | GPU tactile images/contact-force fields and policy-learning tools; sim-to-real experiments | Paper throughput comparisons depend on the original hardware, batch, and workload | Full-loop throughput plus task benefit matters more than an isolated FPS counter |
| [DiffTactile](https://arxiv.org/abs/2403.08716) | FEM sensing elastomer, multi-material mechanics, differentiable fitting/control, optical response | A powerful research system with explicit modeling assumptions; not evidence of universal calibration | Separate the fast approximation from a more detailed mechanics reference |
| [HydroelasticTouch](https://arxiv.org/abs/2501.08077) | Pressure-based tactile simulation using hydroelastic contact surfaces | Pressure approximation is not the same as time-resolved elastomer deformation | Include distributed-pressure baselines when pressure fields are the claim |
| [HydroShear](https://arxiv.org/abs/2603.00446) | Path-dependent shear, stick-slip, and tactile sim-to-real RL on specified tasks | Its success rates are task-specific author results, not a general guarantee | A close baseline for a shear-centered wedge; identify a measurable advantage |

**Interpretation:** a defensible initial claim could be lower held-out contact error at a matched compute budget, less calibration work at matched error, or lower real-data collection cost for a chosen downstream task. None is established for our project yet. Avoid a general claim that existing engines only have rigid contact points: modern systems already offer richer contact models.

## Platforms: integration opportunity and competitive pressure

| Platform | Checked capability | What still needs measurement in our use case | Product consequence |
| --- | --- | --- | --- |
| [Isaac Lab contributed sensors](https://isaac-sim.github.io/IsaacLab/main/source/api/lab_contrib/isaaclab_contrib.sensors.html) | Experimental visuotactile support includes RGB/depth and normal/shear force fields; Taxim-based RGB | Version compatibility, calibration, end-to-end latency, supported geometry and actual real transfer | A Python wrapper alone will not establish differentiation from the existing contribution |
| [Newton](https://developer.nvidia.com/newton-physics) | Extensible Warp/OpenUSD physics with connections to Isaac Lab and MuJoCo Warp | Solver/contact API stability and performance for our chosen workload | Prefer a portable contact/sensor interface over dependence on one backend |
| [Newton collision documentation](https://newton-physics.github.io/newton/1.6.0/concepts/collisions.html) | SDF-based collision and opt-in hydroelastic contact areas | Geometry preprocessing, contact reduction, timestep and solver interaction | Distributed contact is already platform infrastructure, not our invention |
| [MuJoCo sensor implementation](https://github.com/google-deepmind/mujoco/blob/main/plugin/sensor/README.md) | Touch-grid plugin; prior touch-stress functionality moved into a native tactile sensor | What physical quantities and optical outputs our specific model still needs | Compare with native tactile sensing before adding a custom layer |
| [Drake hydroelastic guide](https://drake.mit.edu/doxygen_cxx/group__hydroelastic__user__guide.html) | Distributed contact patches/pressure and documented fallback modes | Pressure-field resolution; no actual deforming-body state in the hydroelastic model | A hydroelastic modulus is not automatically an intrinsic Young's modulus |
| [Genesis tactile documentation](https://genesis-world.readthedocs.io/en/v1.3.0/user_guide/sensing/tactile.html) | Geometry-query tactile probes and approximate taxel force/displacement interfaces | Calibration and coupling to actual solver forces; sandbox values are expressly visualization-oriented | Dense tactile-looking fields need independent physical validation |

The [Genesis sandbox](https://github.com/Genesis-Embodied-AI/genesis-world/blob/main/examples/sensors/tactile_sandbox.py) explicitly warns that its readings have not been calibrated to units. A software field named force is not by itself a calibrated force measurement.

For the NVIDIA objection, the honest starting point is that the ecosystem is already building tactile support. Our proposed advantage would have to be demonstrated in a narrower workflow: measured calibration, validated material/contact assets, useful accuracy/compute tradeoffs, and integration that customers actually adopt. Portability and a growing dataset are hypotheses about future defensibility, not existing moats.

## Learned world models already exist

| Work | Main input/output or use | What it contributes to our thinking | Boundary to preserve |
| --- | --- | --- | --- |
| [SPOTS](https://arxiv.org/abs/2304.11193) | Visual/tactile history and planned interaction support joint sensory prediction | Design experiments with visually ambiguous physical properties | 2023 initial preprint, revised in 2026; benefits are not uniform across every scene |
| [RoboPack](https://arxiv.org/abs/2407.01418) | Tactile-informed learned dynamics and model-predictive manipulation | Real tactile feedback can improve action-conditioned physical prediction | Learned on real interactions; not a simulator-only policy-transfer demonstration |
| [TacForeSight](https://arxiv.org/abs/2606.11184) | Wrist force/torque conditions short-horizon dual-finger tactile latent forecasting used by a policy | Global force and local touch are complementary signals | A force-conditioned forecast is not automatically a candidate-action-conditioned simulator |
| [TACO](https://arxiv.org/abs/2607.02840) | Real rollouts, imagined local corrections, action/value labeling and policy post-training | Synthetic corrections may serve a concrete training workflow | Uses real demonstrations/rollouts; not evidence of learning entirely from our simulated gel images |
| [FeelWorld](https://arxiv.org/abs/2607.24267) | Joint visual latents, contact state, force-related tactile latent and slip forecasts | Contact gating and structured tactile states are useful architecture precedents | Source reports particular planning tasks; latent force-related information is not a calibrated constitutive law |
| [ContactWorld](https://arxiv.org/abs/2606.13877) | Controlled representation comparisons for contact-rich world modeling/planning | Compare spatial structure, temporal coherence and downstream usefulness | Current v3 includes physical trials; do not describe it as simulation-only or generalize one modality win to all tasks |

As of this check, SPOTS reports journal acceptance; TacForeSight, TACO and FeelWorld are treated here as checked 2026 preprints rather than assuming a peer-reviewed venue. ContactWorld's current title is **What Representations Matter for Vision-Tactile Latent World Models in Contact-Rich Manipulation**, updated from the title in the supplied report. Status is a source observation, not a ranking of technical merit.

## Encoders, datasets and physical measurement

[Sparsh](https://arxiv.org/abs/2410.24090) supplies self-supervised optical-touch representations and TacBench. [AnyTouch](https://arxiv.org/abs/2502.12191) studies static/dynamic cross-sensor representations; [AnyTouch 2](https://arxiv.org/abs/2602.09617) adds force-aware dynamic perception with ToucHD. These are candidate baselines or components for perception. A transferable encoder does not by itself identify friction/compliance or predict outcomes under a new action.

[ObjectFolder 2.0](https://arxiv.org/abs/2204.02389) establishes substantial multisensory virtual-object prior art. [ObjectFolder Real](https://arxiv.org/abs/2306.00956) offers measured multisensory objects. Neither source should be presented as establishing a reusable, sensor-independent calibrated contact law for arbitrary material pairs. Evaluate what is actually generated, measured and held out.

[Cluster](https://arxiv.org/abs/2407.16206) provides controlled texture interactions across speeds and directions. The sibling research repo uses it for a restricted vibration-spectrum task. Its local audit reports unresolved acquisition-clock interpretation and missing synchronized per-scan tangential-force/indentation targets for the intended mechanics study. Those local limits remain attached to the saved findings; the dataset paper's broad description cannot repair them.

Candidate additional resources named in the report or earlier catalog include Penn HaTT, LMT, Touch and Go, STAG, human tactile gloves, and MIT planar pushing. Their exact releases, synchronized channels, calibration, licenses and contact-pair overlap need a dataset-specific feasibility review before they become a promised training source. This update does not claim to have re-audited those archives.

## Hardware and whole-body sensing

| Resource | Role today | Implication |
| --- | --- | --- |
| [GelSight Mini](https://www.gelsight.com/products/gelsightmini/) | Commercial optical tactile hardware aimed at robotics/research | Candidate first sensor family; the user's actual model is still unconfirmed |
| [XELA uSkin/uAi](https://xelarobotics.com/technology/) | Distributed three-axis tactile hardware and calibration/visualization software | Potential complement and competing workflow; camera-based gel output is not its universal interface |
| [AnySkin](https://arxiv.org/abs/2409.08276) | Replaceable magnetic sensing and cross-instance learned-model transfer | Sensor replacement is an experimentally important axis of transfer |
| [RobotSweater](https://arxiv.org/abs/2303.02858) | Machine-knitted pressure skin with robot demonstrations | Broad body coverage exists; it brings different spatial/temporal sensing requirements |

Whole-body artificial skin is established research, not an empty category. A simulation spanning fingertips, palm, feet and torso would require different resolutions, compliance, transfer functions, latency and calibration. It is a long-term extension of a validated single-pad system. Thermal and high-frequency vibration channels also need separate acquisition and validation; an RGB contact demo does not establish them.

## Inverse physics and reusable materials

[ChainQueen](https://arxiv.org/abs/1810.01054), DiffTaichi, Dojo, IPC and related differentiable/robust mechanics provide relevant numerical ideas. DiffTactile is a more direct tactile identification precedent. Differentiability can make fitting practical; it cannot make unobservable parameters identifiable. Multiple sensor/object parameter combinations can explain one press trace.

The proposed material asset should therefore include contact-pair identity, units, sensor and geometry calibration, measurement protocol, supported speed/load/temperature range, parameter uncertainty, and held-out prediction errors. A fitted effective stiffness belongs to its model and geometry; it is not automatically a universal material constant. See [technical architecture](technical-architecture.md).

## Candidate first customer and business questions

**Initial customer hypothesis:** a robotics learning team already using one optical tactile sensor and losing engineering time collecting or recalibrating contact data for a narrow manipulation task. Confirm the pain, current workaround, budget owner and frequency through interviews. Academic users may be useful technical partners; research interest alone is not willingness to pay.

Test three offerings before assuming a broad platform:

1. A calibration/validation toolkit that reduces time to an acceptable sensor twin.
2. A simulation module that improves a selected real perception/control result at a fixed data/compute budget.
3. Validated contact/material assets whose reuse saves measurable collection or integration work.

Pricing, customer count, market size, and purchase commitments remain unknown. Build a bottom-up market model from identifiable buyers and plausible annual spend; label scenario assumptions. Do not equate the entire robotics or physical-AI market with addressable tactile software revenue.

## What would change our strategy

| Test | If it succeeds | If it fails |
| --- | --- | --- |
| Existing built-in simulator meets a lab's needs | Offer calibration, assets or workflow value only if pain remains | Avoid selling a thin wrapper |
| Simple mechanics matches the fancy model on real outcomes | Keep the simple model and sell validated utility | Complexity needs a measured benefit |
| Hybrid residual improves reserved contacts | Expand carefully to new specimens/actions | Investigate calibration, identifiability and leakage before scaling |
| Researchers repeatedly run the package on their own data | Test repeated use and a paid pilot | Fix integration or reconsider the buyer/problem |
| Better tactile fidelity improves real task performance | Establish a customer-relevant outcome | Do not use visual realism as a substitute for downstream evidence |

These are proposed decision rules, not reported experiment results.

## Source and license discipline

This repo summarizes linked sources; it does not vendor their software, weights or datasets. **Publicly accessible, downloadable and open-source are different claims.** Check code, weights, datasets and original assets separately at the exact release/commit before commercial reuse or redistribution.

TACTO's checked original [license](https://raw.githubusercontent.com/facebookresearch/tacto/main/LICENSE) is MIT; its original [repository](https://github.com/facebookresearch/tacto) is archived. This does not establish the licenses of third-party meshes, datasets or forks. For the other systems, commercial-use rights have not been comprehensively audited in this preparation repo. Record those results when selecting dependencies; do not inherit the supplied report's repeated "Open source" link labels as license conclusions.

Refresh this landscape before submitting if material time has elapsed. Maintain the distinction among source-checked descriptions, internally observed evidence, and proposed product claims.
