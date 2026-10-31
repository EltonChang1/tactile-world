# Robot grasp with a force-colored object surface

This is the **object-mounted** tactile version: the movable cube itself is covered
with 600 small visible sensing balls (10 × 10 on each of six faces). Contact with
the robot fingers changes each ball's color according to its measured force
magnitude. The balls move with the cube as it is grasped and lifted.

## Play and record

```bash
cd /Users/fan005/Desktop/TactileWorld/genesis-world
source .venv/bin/activate
python -m examples.sensors.franka_contact_video.object_sandbox \
  --interactive --output outputs/my_object_grasp
```

Click the Genesis viewer for keyboard control:

- **J / K**: lower / raise the arm. Begin by lowering the hand toward z = 0.13 m.
- **Arrow keys**: move horizontally.
- **C / O**: close / open the gripper. Close before lifting with K.
- **N / M**: rotate the wrist about the vertical axis.
- **F8** (Fn–F8 on some Macs): pause/resume the combined video recording.
- **Escape**: finish and save. Ctrl-C in Terminal also saves.
- **Backslash**: return the robot target to the starting hover pose; this does not
  teleport or reset the movable cube. If it falls out of reach, start a new run.

The default robot opacity is 0.12. Add `--robot-opacity 0.25` for a more visible
arm, or `--robot-opacity 0.05` for a clearer view through it (0–1 range). This
changes rendering only. Loaded sensing balls are slightly enlarged and emissive
so their force colors remain legible in shadow; this does not change the readings.

Recording starts automatically. `demo.mp4` includes the robot view, a following
close-up of the bead-covered object, with larger labels and a shared contact-color
legend. Force/torque graphs are omitted from the video; readings remain in the
CSV/NPZ exports. Use a new
output directory for every run. Do not use the viewer's R shortcut for this
combined recording. Pausing capture leaves simulation running; recorded spans
are joined, so displayed simulation time can jump. Sensor data covers the entire
session, with a recording-state mask. Long runs retain sensor arrays in memory.

## Generate the automatic sample

```bash
python -m examples.sensors.franka_contact_video.object_sandbox \
  --output outputs/object_grasp_auto
```

Default: 10 simulation seconds at 25 fps, 1600 × 800 MP4. The robot approaches,
closes, lifts, holds, lowers, and opens. `--seconds 6 --fps 10` makes a shorter
smoke test. `--gpu` selects the GPU backend. Interactive mode is unlimited unless
you provide `--seconds`.

## What the colors and exported readings mean

- The small balls are **sensor visualization markers**, not separate physical
  beads or a deformable coating. The cube is one rigid movable body.
- Each ball is driven by a `KinematicTaxel` geometric spring/damper force estimate.
  It is not a painted animation. Zero force is dark blue; increasing magnitude
  runs through cyan, green, yellow, and red. The fixed scale saturates at 0.30 N
  per taxel. Display uses 16 color bins; exported values are not clipped.
- The 3 mm sensing radius can detect near-contact. Colored balls do not by
  themselves establish physical intersection. The cube's lift is a separate
  physical result of the gripper's frictional contact.
- Only the two fingers contribute to these tactile readings. Floor support and
  contact with other arm links are excluded.
- Exported net wrenches sum the object's taxel forces and torques in **object-local axes**, with
  torque about the cube center. Opposing finger forces may cancel in the net
  readings while both contact patches remain brightly colored.
- Estimates are uncalibrated and depend on taxel density and model coefficients.
  They are not joint torques, wrist sensor readings, or solver contact forces.
- The robot and cube shell are rendered translucent so the opaque force-colored
  beads remain visible through the fingers and on the far side. Collision geometry
  and grasp physics are unchanged. Orbit the viewer to inspect other faces.

## Files and customization

`demo.mp4`, `contact_preview.png`, `final_preview.png`, `wrenches.csv`, `data.npz`,
and `metadata.json` are saved to your chosen output folder. NPZ includes per-taxel
forces/torques, aggregate wrenches, object position, local probe coordinates, and
recording state. Metadata includes the actual maximum lift height.

- `object_skin.py`: six-face probe layout, force colors, and 3D sensing balls.
- `object_sandbox.py`: physical object, robot, grasp motion, controls, and export.
- `object_dashboard.py`: two large scene views and the contact-color legend.

This reuses the earlier demo's keyboard controller and MP4 writer. The earlier
finger-mounted example remains available with its original command.
