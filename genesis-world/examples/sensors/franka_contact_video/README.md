# Franka contact video

For the **object covered with small 3D sensing balls** and a movable-cube grasp,
see [Object sandbox](OBJECT_SANDBOX.md). Its entry point is
`python -m examples.sensors.franka_contact_video.object_sandbox --interactive --output outputs/object_play`.

A self-running example: one Franka arm approaches one fixed sphere, closes its
gripper, slides and twists gently, releases, and retreats. No training or keyboard
teleoperation is required. The fixed sphere makes repeatable contact possible;
this is a touch demonstration, not a free-object grasping benchmark.

## Run on this Mac

From Terminal:

```bash
cd /Users/fan005/Desktop/TactileWorld/genesis-world
source .venv/bin/activate
python -m examples.sensors.franka_contact_video --output outputs/my_contact_video
```

The default is CPU simulation, 10 simulated seconds, 25 fps, 1600 × 1200 MP4.
Rendering can take considerably longer than the movie's duration, especially on
the first run when simulation kernels compile. There is no need to open a viewer.
Progress prints once per simulated second. Use a new output directory for each
run: the program refuses to overwrite an existing movie/data export.

Optional switches:

```bash
# Open a viewer while the automatic sequence runs:
python -m examples.sensors.franka_contact_video --vis --output outputs/contact_with_viewer

# Try the GPU backend on supported hardware:
python -m examples.sensors.franka_contact_video --gpu --output outputs/contact_gpu

# Short smoke test; faster movement changes the measured dynamics:
python -m examples.sensors.franka_contact_video --seconds 2 --fps 10 --output outputs/contact_test
```

## Interactive sandbox: play and record your own video

```bash
cd /Users/fan005/Desktop/TactileWorld/genesis-world
source .venv/bin/activate
python -m examples.sensors.franka_contact_video --interactive --output outputs/my_interactive_session
```

This opens the Genesis viewer and a live dashboard. Click **the Genesis viewer**
to give it keyboard focus. Recording of the complete dashboard starts automatically.
Unlike `--vis`, `--interactive` replaces the automatic trajectory with your controls:

- Arrow keys: move the arm in XY, 1 mm per hold callback.
- J / K: lower / raise the hand.
- C / O: gradually close / open the fingers; the position stays when released.
- N / M: rotate the wrist around the vertical axis.
- Backslash: reset the target to the starting hover pose with an open gripper.
- F8: pause/resume the **combined dashboard MP4**, including the force fields.
  Some Macs require Fn–F8. Do not use the viewer's R shortcut for this: R records
  only the viewer, without the dashboard.
- Escape: finish and save. Escape also works in the dashboard window, or use
  Ctrl-C in Terminal. Closing the Genesis viewer also finishes the session.

Try lowering the hand with J from its initial 0.24 m height toward 0.145 m,
then close gently with C. Move a little sideways or rotate with N/M to see
the taxel arrows change. Open with O, then raise with K to release contact.
Movement targets are bounded to a small workspace around the sphere.

The run continues until you quit; optionally add `--seconds 60` to limit it to
60 **simulation** seconds. CPU rendering may be slower than real time. Full
sensor data is kept in memory until exit, so prefer short recording sessions.

Your file is `outputs/my_interactive_session/demo.mp4`. Use a fresh output folder
for the next take. F8 pauses video capture, not simulation or sensor sampling:
the video joins the recorded spans, and its time labels can jump. CSV/NPZ contain
the whole session; `data.npz["recording"]` marks the recording state per sample.
`metadata.json` distinguishes simulated duration from recorded video duration.

If creating a fresh environment, install `torch`, then `pip install -e . matplotlib`.
Genesis supplies PyAV, Pillow, and the other rendering dependencies. Supported
frame rates divide the 100 Hz simulation rate exactly.

## What the movie shows

- The whole robot and a close-up of its gripper touching the sphere.
- Colored sensing points on each fingertip, using the same depth scale as the maps.
- Two 12 × 12 contact-depth maps. The fixed color scale runs from 0 to 4 mm;
  values above 4 mm saturate visually, while the raw export retains them.
- Two **per-taxel force fields**, like the original tactile sandbox: 144 dots per
  finger colored by full force magnitude (0–0.35 N), straight arrows for local
  x/z tangential force, and curved arrows for torque about the pad normal
  (0, -1, 0). Pure normal force colors the dots but has no in-plane straight
  arrow. Straight arrows use 80 mm/N display gain; arc radius uses 4000 mm/(N·m),
  capped at 0.6 mm for legibility. These are visualization gains, not deformation.
  Twist colors saturate at ±0.0002 N·m; raw data is not clipped.
- All three force components and all three torque components for each finger.
  Graphs grow with time; their vertical limits adapt to the recorded history.

The depth is `max(0, probe_radius - signed_distance)`, with a 3 mm probe radius.
Consequently a positive signal does not necessarily mean the rigid surfaces
physically intersect. The colors show the fingertip sensing surface, not a
deformable skin simulation or a pressure map on the whole sphere.

Force and torque come from Genesis `KinematicTaxel`, a geometric spring/damper
model. They are **uncalibrated model estimates**, not solver reaction forces,
wrist force/torque measurements, or the robot's joint torques. Each finger uses
its own local coordinate frame; opposing fingers need not have the same signs.
Only sphere contacts are included; the robot and ground are filtered out.

The resultant force sums the taxel forces. Genesis's per-taxel torque already
contains the moment arm about the finger link origin. We translate the sum to
the pad center using `T_pad = sum(T_link) - center × sum(F)`. Adding another
`r × F` term would incorrectly count that contribution twice. Signal magnitudes
depend on the sensor coefficients and taxel resolution; keep the grid fixed when
comparing runs, or calibrate the model for a changed grid.

## Output files

- `demo.mp4`: composed video with synchronized views and graphs.
- `contact_preview.png`: frame with the largest sampled contact depth.
- `final_preview.png`: last frame, including the complete graph history.
- `wrenches.csv`: 100 Hz time series, with left/right Fx/Fy/Fz and Tx/Ty/Tz.
- `data.npz`: 100 Hz depth and per-taxel force/torque arrays, aggregate pad
  wrenches, and probe coordinates. Raw torque is about the link origin.
- `metadata.json`: units/frame context, timestep, grid, backend, and peak depth.

For example:

```python
import numpy as np
data = np.load("outputs/my_contact_video/data.npz")
print(data["depth"].shape)  # (steps, 2 fingers, 144 taxels), meters
print(data["pad_force"].shape)  # (steps, 2 fingers, 3 components), N
```

## How to customize

- `scene.py`: scene, sensor layout, model coefficients, camera placement, and
  smooth motion keyframes. `trajectory()` controls approach/touch/slide/release.
- `dashboard.py`: movie layout, graph styling, color scale, and MP4 encoding.
- `field.py`: per-taxel force dots, shear arrows, and twist arcs.
- `controls.py`: keyboard targets, workspace limits, and recording controls.
- `__main__.py`: simulation loop, synchronized sampling, export, and CLI options.

Start with camera or color changes. Next, adjust the small slide/yaw motion in
`trajectory()`. If changing sphere size or location, update the approach height
and finger opening together so the gripper actually reaches the surface.

Run the focused math checks with:

```bash
python -m unittest examples.sensors.franka_contact_video.test_math
```
