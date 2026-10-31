"""Scene construction and smooth, deterministic targets; no plotting dependencies."""

import numpy as np

import genesis as gs
import genesis.utils.geom as gu

DT = 0.01
GRID = 12
RADIUS = 0.003


def trajectory(fraction):
    """Hover, approach, squeeze, slide/twist, release, and retreat."""
    knots = np.array([0, .12, .28, .43, .60, .74, .87, 1.0])
    # hand x, y, z, yaw degrees, finger opening (each finger)
    poses = np.array([
        [.50, 0, .24, 0, .04], [.50, 0, .24, 0, .04],
        [.50, 0, .145, 0, .04], [.50, 0, .145, 0, .025],
        [.506, 0, .148, 12, .025], [.494, 0, .142, -12, .025],
        [.50, 0, .145, 0, .04], [.50, 0, .24, 0, .04],
    ])
    i = min(np.searchsorted(knots, fraction, side="right") - 1, len(knots) - 2)
    i = max(i, 0)
    u = np.clip((fraction - knots[i]) / (knots[i + 1] - knots[i]), 0, 1)
    u = u * u * (3 - 2 * u)
    pose = poses[i] * (1 - u) + poses[i + 1] * u
    phase = ("Hover", "Approach", "Touch / squeeze", "Slide / twist", "Reverse slide / twist", "Release", "Retreat")[i]
    return pose[:3], gu.euler_to_quat((0, 180, pose[3])), pose[4], phase


def build_scene(show_viewer=False):
    scene = gs.Scene(
        sim_options=gs.options.SimOptions(dt=DT, substeps=4),
        rigid_options=gs.options.RigidOptions(constraint_timeconst=.01),
        viewer_options=gs.options.ViewerOptions(camera_pos=(1.25, -1.1, .8), camera_lookat=(.3, 0, .3)),
        show_viewer=show_viewer,
    )
    floor = scene.add_entity(gs.morphs.Plane())
    robot = scene.add_entity(gs.morphs.MJCF(file="xml/franka_emika_panda/panda.xml"))
    scene.add_entity(
        gs.morphs.Sphere(radius=.04, pos=(.5, 0, .04), fixed=True),
        # Translucent surface exposes the colored taxels at the contact interface.
        surface=gs.surfaces.Default(color=(.25, .65, .85), opacity=.35),
    )
    grid = gu.generate_grid_points_on_plane(
        lo=(-.006, 0, .035), hi=(.008, 0, .052), normal=(0, -1, 0), nx=GRID, ny=GRID,
    ).reshape(-1, 3)
    # Ignore the robot and floor: only the sphere can contribute tactile readings.
    excluded = tuple(link.idx for link in robot.links) + (floor.base_link_idx,)
    links, depths, taxels = [], [], []
    for name in ("left_finger", "right_finger"):
        link = robot.get_link(name)
        common = dict(entity_idx=robot.idx, link_idx_local=link.idx_local,
                      probe_local_pos=grid, probe_radius=RADIUS, filter_link_idx=excluded)
        depths.append(scene.add_sensor(gs.sensors.ContactDepthProbe(**common)))
        taxels.append(scene.add_sensor(gs.sensors.KinematicTaxel(
            normal_stiffness=2000, normal_damping=1, normal_exponent=1.5,
            shear_scalar=.1, twist_scalar=.001, **common,
        )))
        links.append(link)
    cameras = [
        scene.add_camera(res=(640, 480), pos=(1.25, -1.1, .8), lookat=(.3, 0, .3), fov=45, debug=True),
        scene.add_camera(res=(640, 480), pos=(.72, -.18, .11), lookat=(.5, 0, .04),
                         fov=38, near=.01, debug=True),
    ]
    scene.build()
    arm = np.arange(robot.n_dofs - 2)
    fingers = np.arange(robot.n_dofs - 2, robot.n_dofs)
    robot.set_dofs_kp([4500, 4500, 3500, 3500, 2000, 2000, 2000, 100, 100])
    robot.set_dofs_kv([450, 450, 350, 350, 200, 200, 200, 10, 10])
    pos, quat, opening, _ = trajectory(0)
    q = robot.inverse_kinematics(link=robot.get_link("hand"), pos=pos, quat=quat, dofs_idx_local=arm)
    robot.set_qpos(q[arm], arm)
    robot.set_dofs_position(opening, fingers)
    return scene, robot, arm, fingers, grid, links, depths, taxels, cameras


def pad_wrench(force, torque, grid):
    """KinematicTaxel torque already includes r x F about the link origin.

    Translate that moment to the pad center, without adding r x F twice.
    Both outputs remain in the individual finger's local frame.
    """
    total_force = force.sum(axis=-2)
    return total_force, torque.sum(axis=-2) - np.cross(grid.mean(axis=0), total_force)
