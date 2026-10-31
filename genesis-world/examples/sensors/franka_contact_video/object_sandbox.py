"""Grasp a movable cube covered in force-colored sensing beads.

python -m examples.sensors.franka_contact_video.object_sandbox --interactive --output outputs/object_play
"""
import argparse
import json
from pathlib import Path
import numpy as np
from PIL import Image
import genesis as gs
import genesis.utils.geom as gu
from genesis.utils.misc import tensor_to_array
from .controls import Controls
from .dashboard import Movie
from .object_skin import ObjectSkin, SIZE, FORCE_MAX
from .object_dashboard import ObjectDashboard, FRAME_SIZE

DT = .01


def grasp_target(fraction):
    knots = np.array([0, .12, .30, .45, .65, .75, .88, 1])
    # Grasp, lift, hold, lower, open. Finger targets are forces through PD control.
    poses = np.array([[.24,.04], [.24,.04], [.13,.04], [.13,0],
                      [.26,0], [.26,0], [.13,0], [.13,.04]])
    i = np.clip(np.searchsorted(knots, fraction, side='right')-1, 0, len(knots)-2)
    u = np.clip((fraction-knots[i])/(knots[i+1]-knots[i]),0,1)
    u = u*u*(3-2*u)
    z, opening = poses[i]*(1-u)+poses[i+1]*u
    phase = ('Hover','Approach','Close / grasp','Lift','Hold','Lower','Release')[i]
    return np.array([.5,0,z]), gu.euler_to_quat((0,180,0)), opening, phase


def build(show_viewer, robot_opacity=.12):
    scene = gs.Scene(sim_options=gs.options.SimOptions(dt=DT, substeps=4),
                     rigid_options=gs.options.RigidOptions(constraint_timeconst=.01, box_box_detection=True),
                     viewer_options=gs.options.ViewerOptions(camera_pos=(.85,-.8,.65), camera_lookat=(.35,0,.25)),
                     show_viewer=show_viewer)
    floor = scene.add_entity(gs.morphs.Plane())
    robot = scene.add_entity(gs.morphs.MJCF(file='xml/franka_emika_panda/panda.xml'),
                             material=gs.materials.Rigid(friction=1.5),
                             surface=gs.surfaces.Default(opacity=robot_opacity))
    obj = scene.add_entity(gs.morphs.Box(size=(SIZE,)*3, pos=(.5,0,SIZE/2)),
                           material=gs.materials.Rigid(rho=200, friction=1.5),
                           surface=gs.surfaces.Default(color=(.78,.81,.85), opacity=.10))
    finger_links = {robot.get_link(name).idx for name in ('left_finger','right_finger')}
    # Only finger contacts color the cube; support from the floor is deliberately excluded.
    excluded = (floor.base_link_idx, obj.base_link_idx) + tuple(l.idx for l in robot.links if l.idx not in finger_links)
    skin = ObjectSkin(scene, obj, excluded)
    cameras = [scene.add_camera(res=(800,600), pos=(1,-1,.75), lookat=(.3,0,.3), fov=45, debug=True),
               scene.add_camera(res=(800,600), pos=(.62,.17,.105), lookat=(.5,0,.035), fov=33, near=.01, debug=True)]
    scene.build()
    arm = np.arange(robot.n_dofs-2)
    fingers = np.arange(robot.n_dofs-2,robot.n_dofs)
    robot.set_dofs_kp([4500,4500,3500,3500,2000,2000,2000,300,300])
    robot.set_dofs_kv([450,450,350,350,200,200,200,15,15])
    pos,quat,opening,_ = grasp_target(0)
    hand = robot.get_link('hand')
    q = robot.inverse_kinematics(link=hand,pos=pos,quat=quat,dofs_idx_local=arm)
    robot.set_qpos(q[arm],arm)
    robot.set_dofs_position(opening,fingers)
    robot.control_dofs_position(q[arm],arm)
    robot.control_dofs_position(opening,fingers)
    for _ in range(30):
        scene.step()
    return scene,robot,obj,skin,cameras,arm,fingers,hand


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--interactive',action='store_true')
    parser.add_argument('--seconds',type=float)
    parser.add_argument('--fps',type=int,choices=(10,20,25,50),default=25)
    parser.add_argument('--gpu',action='store_true')
    parser.add_argument('--robot-opacity',type=float,default=.12,help='0 = invisible robot, 1 = opaque; visualization only')
    parser.add_argument('--output',type=Path,default=Path('outputs/object_skin'))
    args = parser.parse_args()
    if args.seconds is None and not args.interactive:
        args.seconds=10
    if args.seconds is not None and (not np.isfinite(args.seconds) or args.seconds<1):
        parser.error('--seconds must be finite and at least 1')
    if not 0 <= args.robot_opacity <= 1:
        parser.error('--robot-opacity must be between 0 and 1')
    args.output.mkdir(parents=True,exist_ok=True)
    if any(args.output.iterdir()):
        parser.error('Choose an empty output directory; previous recordings are preserved')
    gs.init(backend=gs.gpu if args.gpu else gs.cpu,precision='32',seed=0,logging_level='warning')
    scene,robot,obj,skin,cameras,arm,fingers,hand = build(args.interactive, args.robot_opacity)
    controls = Controls() if args.interactive else None
    if controls:
        import cv2
        controls.bind(scene.viewer)
        cv2.namedWindow('Object tactile dashboard',cv2.WINDOW_NORMAL)
        cv2.resizeWindow('Object tactile dashboard',1200,600)
        print('Viewer controls: J/K lower/raise, arrows XY, C/O close/open, N/M yaw, F8 recording, Escape save/quit.',flush=True)
    dashboard = ObjectDashboard()
    movie = Movie(args.output/'demo.mp4',args.fps,size=FRAME_SIZE)
    times,forces,torques,positions,raw_forces,raw_torques,recording = [],[],[],[],[],[],[]
    stride = round(1/(DT*args.fps))
    steps = round(args.seconds/DT) if args.seconds else None
    step,frames,peak = 0,0,-1
    frame = None
    try:
        while steps is None or step<steps:
            if controls:
                if not controls.running or not scene.viewer.is_alive():
                    break
                pos,quat,opening = controls.target()
                phase = 'Interactive '+('REC' if controls.recording else 'PAUSED')
            else:
                pos,quat,opening,phase = grasp_target((step+1)/steps)
            q = robot.inverse_kinematics(link=hand,pos=pos,quat=quat,dofs_idx_local=arm)
            robot.control_dofs_position(q[arm],arm)
            robot.control_dofs_position(opening,fingers)
            scene.step()
            step+=1
            force,torque = skin.read()
            object_pos = tensor_to_array(obj.get_pos()).copy()
            times.append(step*DT)
            forces.append(force.sum(axis=0))
            torques.append(torque.sum(axis=0))  # Cube link origin is its center; r x F is already included.
            positions.append(object_pos)
            raw_forces.append(force)
            raw_torques.append(torque)
            recording.append(controls.recording if controls else True)
            if step%stride:
                continue
            skin.draw(force)
            camera_offset = gu.transform_by_quat(np.array([.025,.22,.045]), tensor_to_array(obj.get_quat()))
            cameras[1].set_pose(pos=object_pos+camera_offset,lookat=object_pos)
            rgb = [tensor_to_array(cam.render()[0]) for cam in cameras]
            frame = dashboard.frame(rgb,times[-1],phase,object_pos[2]-SIZE/2)
            if recording[-1]:
                movie.write(frame)
                frames+=1
            if controls:
                cv2.imshow('Object tactile dashboard',cv2.cvtColor(frame,cv2.COLOR_RGB2BGR))
                if cv2.waitKey(1)&0xff == 27:
                    controls.stop()
            strength=np.linalg.norm(force,axis=-1).sum()
            if strength>peak:
                peak=strength
                Image.fromarray(frame).save(args.output/'contact_preview.png')
            if step%100==0:
                print(f'{step*DT:.1f}s {phase}; lift={(object_pos[2]-SIZE/2)*1000:.1f}mm; active beads={np.count_nonzero(np.linalg.norm(force,axis=-1)>1e-6)}',flush=True)
    except KeyboardInterrupt:
        print('Saving session...',flush=True)
    finally:
        movie.close()
        if controls:
            cv2.destroyAllWindows()
    if frame is None:
        return
    Image.fromarray(frame).save(args.output/'final_preview.png')
    np.savez_compressed(args.output/'data.npz',time=times,force=raw_forces,torque=raw_torques,
                        object_force=forces,object_torque=torques,object_position=positions,
                        probe_local_pos=skin.positions,recording=recording)
    np.savetxt(args.output/'wrenches.csv',np.column_stack((times,forces,torques)),delimiter=',',
               header='time_s,Fx_N,Fy_N,Fz_N,Tx_Nm,Ty_Nm,Tz_Nm',comments='')
    metadata=dict(simulation_seconds=step*DT,video_seconds=frames/args.fps,frames=frames,fps=args.fps,
                  robot_opacity=args.robot_opacity,taxels=len(skin.positions),frame='object local',torque_origin='cube center',
                  model='uncalibrated KinematicTaxel',color_max_N=FORCE_MAX,
                  max_lift_m=float(np.max(np.asarray(positions)[:,2])-SIZE/2))
    (args.output/'metadata.json').write_text(json.dumps(metadata,indent=2)+'\n')
    print(f'Saved {args.output.resolve()/"demo.mp4"}',flush=True)


if __name__=='__main__':
    main()
