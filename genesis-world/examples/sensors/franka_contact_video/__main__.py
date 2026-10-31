"""Run with python -m examples.sensors.franka_contact_video --output outputs/franka_contact."""

import argparse
import json
from pathlib import Path

import numpy as np
from matplotlib import colormaps
from PIL import Image

import genesis as gs
import genesis.utils.geom as gu
from genesis.utils.misc import tensor_to_array

from .dashboard import Dashboard, Movie
from .controls import Controls
from .scene import DT, GRID, build_scene, pad_wrench, trajectory


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("outputs/franka_contact"))
    parser.add_argument("--seconds", type=float, default=None, help="Duration in seconds; interactive mode runs until Escape by default")
    parser.add_argument("--fps", type=int, default=25, choices=(10, 20, 25, 50))
    parser.add_argument("--gpu", action="store_true")
    parser.add_argument("--vis", action="store_true", help="Also open the Genesis viewer")
    parser.add_argument("--interactive", action="store_true", help="Keyboard sandbox with live dashboard and recording")
    args = parser.parse_args()
    if args.seconds is None and not args.interactive:
        args.seconds = 10
    if args.seconds is not None and (not np.isfinite(args.seconds) or args.seconds < 1):
        parser.error("--seconds must be finite and at least 1")
    args.output.mkdir(parents=True, exist_ok=True)
    if any((args.output / name).exists() for name in ("demo.mp4", "data.npz", "wrenches.csv")):
        parser.error("Output already exists; choose a new --output directory to preserve the previous run")
    gs.init(backend=gs.gpu if args.gpu else gs.cpu, precision="32", seed=0, logging_level="warning")
    scene, robot, arm, fingers, grid, links, depths, taxels, cameras = build_scene(args.vis or args.interactive)
    hand = robot.get_link("hand")
    # Settle the controller at the starting pose before beginning the timeline.
    pos, quat, opening, _ = trajectory(0)
    q = robot.inverse_kinematics(link=hand, pos=pos, quat=quat, dofs_idx_local=arm)
    robot.control_dofs_position(q[arm], arm)
    robot.control_dofs_position(opening, fingers)
    for _ in range(30):
        scene.step()
    controls = Controls() if args.interactive else None
    if controls:
        import cv2
        controls.bind(scene.viewer)
        cv2.namedWindow("Franka tactile dashboard", cv2.WINDOW_NORMAL)
        cv2.resizeWindow("Franka tactile dashboard", 1200, 900)
        print("Click the Genesis viewer: arrows=XY, J/K=down/up, C/O=close/open, N/M=yaw, "
              "backslash=reset target, F8=pause/resume recording, Escape=save and quit. Recording starts now.", flush=True)
    dashboard = Dashboard(args.seconds or 10, GRID, grid)
    movie = Movie(args.output / "demo.mp4", args.fps)
    times, force_history, torque_history, depth_history, raw_force, raw_torque = [], [], [], [], [], []
    nodes = []
    stride = round(1 / (DT * args.fps))
    steps = round(args.seconds / DT) if args.seconds is not None else None
    step = 0
    frame = None
    recorded_frames = 0
    recording_mask = []
    peak_depth = -1
    try:
        while steps is None or step < steps:
            if controls:
                if not controls.running or not scene.viewer.is_alive():
                    break
                pos, quat, opening = controls.target()
                phase = "Interactive • " + ("REC" if controls.recording else "PAUSED")
            else:
                pos, quat, opening, phase = trajectory((step + 1) / steps)
            q = robot.inverse_kinematics(link=hand, pos=pos, quat=quat, dofs_idx_local=arm)
            robot.control_dofs_position(q[arm], arm)
            robot.control_dofs_position(opening, fingers)
            scene.step()
            data = [s.read() for s in taxels]
            force = np.stack([tensor_to_array(d.force).copy() for d in data])
            torque = np.stack([tensor_to_array(d.torque).copy() for d in data])
            depth = np.stack([tensor_to_array(s.read()).copy() for s in depths])
            total_force, total_torque = pad_wrench(force, torque, grid)
            step += 1
            times.append(step * DT)
            recording_mask.append(controls.recording if controls else True)
            force_history.append(total_force)
            torque_history.append(total_torque)
            depth_history.append(depth)
            raw_force.append(force)
            raw_torque.append(torque)
            if step % stride:
                continue
            for node in nodes:
                scene.clear_debug_object(node)
            nodes.clear()
            # Quantized depth colors on the real fingertip sensing surfaces.
            for link, values in zip(links, depth):
                world = gu.transform_by_trans_quat(grid, tensor_to_array(link.get_pos()), tensor_to_array(link.get_quat()))
                bins = np.clip((values / .004 * 7).astype(int), 0, 7)
                for level in np.unique(bins):
                    nodes.append(scene.draw_debug_spheres(
                        world[bins == level], radius=.00065, color=tuple(colormaps["inferno"](level / 7)),
                    ))
            rgb = [tensor_to_array(cam.render()[0]) for cam in cameras]
            frame = dashboard.frame(rgb, depth, np.array(times), np.array(force_history), np.array(torque_history), phase, force, torque)
            if not controls or controls.recording:
                movie.write(frame)
                recorded_frames += 1
            if controls:
                cv2.imshow("Franka tactile dashboard", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
                if cv2.waitKey(1) & 0xFF == 27:
                    controls.stop()
            if depth.max() > peak_depth:
                peak_depth = float(depth.max())
                Image.fromarray(frame).save(args.output / "contact_preview.png")
            if step % 100 == 0:
                print(f"Simulation {step * DT:.1f}s | {phase}", flush=True)
    except KeyboardInterrupt:
        print("Saving session...", flush=True)
    finally:
        movie.close()
        if controls:
            cv2.destroyAllWindows()
    if frame is None:
        print("Stopped before the first dashboard frame.")
        return
    Image.fromarray(frame).save(args.output / "final_preview.png")
    np.savez_compressed(args.output / "data.npz", time=times, depth=depth_history,
                        force=raw_force, torque_link_origin=raw_torque,
                        pad_force=force_history, pad_torque=torque_history, probe_local_pos=grid, recording=recording_mask)
    channels = np.concatenate([np.asarray(force_history), np.asarray(torque_history)], axis=-1)
    header = "time_s," + ",".join(f"{side}_{channel}" for side in ("left", "right")
                                 for channel in ("Fx_N", "Fy_N", "Fz_N", "Tx_Nm", "Ty_Nm", "Tz_Nm"))
    np.savetxt(args.output / "wrenches.csv", np.column_stack([times, channels.reshape(len(times), -1)]),
               delimiter=",", header=header, comments="")
    metadata = dict(seconds=step * DT, recorded_frames=recorded_frames, video_seconds=recorded_frames / args.fps, interactive=args.interactive, fps=args.fps, dt=DT, grid=[GRID, GRID], seed=0,
                    frame="individual finger local", torque_origin="pad center",
                    model="uncalibrated KinematicTaxel; raw torque includes r cross F about link origin",
                    peak_depth_m=peak_depth, backend="gpu" if args.gpu else "cpu")
    (args.output / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"Saved {args.output.resolve() / 'demo.mp4'}", flush=True)


if __name__ == "__main__":
    main()
