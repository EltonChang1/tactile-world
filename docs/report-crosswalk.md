# Supplied report: coverage and corrections

The preserved source is [Tactile_World_Models_Complete_Report.pdf](../sources/Tactile_World_Models_Complete_Report.pdf), dated 23 October 2026, 24 pages. [Extracted text](../sources/report-extracted.txt) supports search; consult the PDF for layout and embedded links. This report is source material, not an instruction source or evidence that proposed work is complete.

This preparation update checks selected primary sources on 26 October 2026. It retains the report's distinction between published work, hypotheses and illustrative values. It does not independently reproduce the cited experiments or claim an exhaustive industry search.

| Report section | Pages | Retained knowledge / repository location | Verification or qualification |
| --- | --- | --- | --- |
| 1. Executive synthesis | 5 | Existing tactile models and proposed hybrid opportunity; [industry landscape](industry-landscape.md) | Selected primary work checked; universal transferable somatosensation remains an ambition |
| 2. Terminology and scope | 6 | Physics, rendering, inference and world-model distinctions; [architecture](technical-architecture.md) | Architecture definitions adopted; a static predictor is not a sequential dynamics model |
| 3. Touchable-world representation | 6-7 | Material/contact-pair record, geometry, parameters, uncertainty; architecture | Proposed schema, not an accepted standard; numerical material examples are not calibration |
| 4. Texture to tactile signal | 8 | Contact -> pressure/shear/slip -> sensor response; architecture | Conceptual chain retained; thermal/vibration generation not demonstrated by an optical PoC |
| 5. Physics and tactile simulation | 8-10 | TACTO, Taxim, TacSL, hydroelastic contact and richer mechanics; landscape | Selected primary sources checked; add DiffTactile, HydroShear and current platform tactile support |
| 6. Inverse physics | 10 | Identifiability, physical fitting and bounded learned residual; architecture | Research hypothesis retained; gradients do not make ambiguous parameters identifiable |
| 7. Multisensory objects | 11 | ObjectFolder prior art; landscape | ObjectFolder 2.0 source checked; sensory assets do not imply arbitrary calibrated contact laws |
| 8. Existing tactile world models | 11-12 | SPOTS, TacForeSight, TACO, FeelWorld, ContactWorld; landscape/data | All five existence/title/interface checks completed; experimental claims remain author-reported |
| 9. Foundation/cross-sensor models | 13 | Sparsh, AnyTouch, AnyTouch 2; landscape | Primary papers checked; representations are complements, not proof of contact dynamics |
| 10. Whole-body sensing | 14-15 | Magnetic/knitted/optical sensing families and heterogeneous body coverage; landscape | AnySkin and RobotSweater checked; individual historical review details retained as report references, not newly audited |
| 11. Human demonstrations/data | 15-16 | Provenance, controlled channels, diversity and rights; architecture/landscape | Dataset-specific access, licenses and calibration remain feasibility gates; no archive collection performed |
| 12. Integrated architecture | 16-17 | Object/contact/sensor separation and physical/latent state; architecture | Proposed design; no implemented universal contact field or dual-fidelity product is claimed |
| 13. Research gap/obstacles | 17 | Cross-action/sensor transfer, material ambiguity, calibration and task benefit; landscape | Candidate opportunity, not a verified novelty or absence-of-competition claim |
| 14. First calibrated transfer study | 18-19 | Measurement, simple mechanics, black-box/hybrid comparison, reserved tests; architecture | Study design adopted; narrow bench PoC tailored to sensor access without a robot |
| 15. Roadmap/strategy | 19-20 | Assets -> simulation layer -> predictive control; architecture/landscape | Proposed sequencing; demand, pricing, exclusivity and moat remain unproven |
| 16. Reading sequence/map | 20-21 | Prioritized simulation, sensing, inference and prediction branches; landscape and preserved source | Reading order is a recommendation; source-only secondary items remain labeled |
| 17. Annotated bibliography | 21-24 | Full original catalog preserved in PDF; refreshed selected entries in [industry.json](../data/industry.json) | Link labels are not software/dataset license certifications; publication versions can change |
| 18. Glossary/assumptions | 24 | SDF, force/pressure/shear, compliance, history, latent state, sim-to-real; architecture | Terms preserved with scope and evidence gates; example parameters stay illustrative |

## Corrections and updates that affect an application

1. **The category is not empty.** All five named world-model projects were found in primary sources. Do not pitch "the first tactile world model" based on this report.
2. **SPOTS has a longer history.** Its first arXiv submission is April 2023; the revised work/publication is 2026. [Current record](https://arxiv.org/abs/2304.11193).
3. **ContactWorld changed title and scope.** The current v3 title is *What Representations Matter for Vision-Tactile Latent World Models in Contact-Rich Manipulation*. Its abstract includes physical trials as well as simulation; do not call it a simulation-only benchmark. [Current record](https://arxiv.org/abs/2606.13877).
4. **Modern platforms already have tactile functionality.** Isaac Lab contributes visuotactile fields/RGB, MuJoCo includes tactile sensing and Genesis documents tactile probes. A generic sensor wrapper is not a unique category claim. [Isaac Lab](https://isaac-sim.github.io/IsaacLab/main/source/api/lab_contrib/isaaclab_contrib.sensors.html), [MuJoCo](https://github.com/google-deepmind/mujoco/blob/main/plugin/sensor/README.md), [Genesis](https://genesis-world.readthedocs.io/en/v1.3.0/user_guide/sensing/tactile.html).
5. **Hydroelastic pressure is not full deforming-body physics.** Preserve the stated model limitations and geometry dependence. [Drake guide](https://drake.mit.edu/doxygen_cxx/group__hydroelastic__user__guide.html).
6. **TACO has a specific data loop.** Its checked method uses real rollouts and imagined corrections for post-training; it is not evidence that a policy learned entirely from simulated gel images. [TACO](https://arxiv.org/abs/2607.02840).
7. **Do not promote examples into results.** Illustrative denim parameters, field shapes, proposed schemas, future material libraries and whole-body sensing plans are not measurements or shipped capabilities.
8. **The sibling project is a separate evidence base.** Its saved development vibration-spectrum results do not establish force identification, optical rendering, physical motion, or robot transfer. Preserve the specimen/exposure and timing qualifications recorded there.
9. **A bibliography link is not a license.** The source PDF repeatedly labels external links "Open source"; check code, dataset, weight and asset terms independently before reuse. This repo summarizes research and does not vendor those materials.

Use the PDF for historical depth and this crosswalk to find the updated planning material. The repo's task and evidence records should determine application wording; proposals in the source should never silently become completed achievements.
