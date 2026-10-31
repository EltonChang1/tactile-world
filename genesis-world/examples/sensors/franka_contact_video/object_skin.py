"""Object-mounted taxels: probe geometry and visible force-colored bead overlay."""
import numpy as np
from matplotlib.colors import LinearSegmentedColormap

import genesis as gs
import genesis.utils.geom as gu
from genesis.utils.misc import tensor_to_array

SIZE = .05
FORCE_MAX = .30
CONTACT_CMAP = LinearSegmentedColormap.from_list('contact_force', ['#4169e1', '#00cfff', '#6dff8a', '#ffee00', '#ff2100'])


def cube_taxels(n=10):
    """Six grids at face centers, with no duplicate edge/corner probes."""
    centers = (np.arange(n) + .5) * SIZE / n - SIZE / 2
    a, b = np.meshgrid(centers, centers)
    positions, normals = [], []
    for axis in range(3):
        other = [i for i in range(3) if i != axis]
        for sign in (-1, 1):
            p = np.zeros((n * n, 3))
            p[:, axis] = sign * SIZE / 2
            p[:, other[0]], p[:, other[1]] = a.ravel(), b.ravel()
            normal = np.zeros_like(p)
            normal[:, axis] = sign
            positions.append(p)
            normals.append(normal)
    return np.concatenate(positions), np.concatenate(normals)


class ObjectSkin:
    def __init__(self, scene, obj, excluded):
        self.scene, self.obj = scene, obj
        self.positions, self.normals = cube_taxels()
        self.sensor = scene.add_sensor(gs.sensors.KinematicTaxel(
            entity_idx=obj.idx, link_idx_local=0, probe_local_pos=self.positions,
            probe_radius=.003, filter_link_idx=excluded,
            normal_stiffness=1000, normal_exponent=1.5, normal_damping=1,
            shear_scalar=.03, twist_scalar=.0005,
        ))
        self.nodes = []

    def read(self):
        reading = self.sensor.read()
        return tensor_to_array(reading.force).copy(), tensor_to_array(reading.torque).copy()

    def draw(self, force):
        for node in self.nodes:
            self.scene.clear_debug_object(node)
        self.nodes.clear()
        # Offset the visible beads slightly so they sit on, rather than inside, the surface.
        world = gu.transform_by_trans_quat(
            self.positions + self.normals * .0007,
            tensor_to_array(self.obj.get_pos()), tensor_to_array(self.obj.get_quat()),
        )
        magnitude = np.linalg.norm(force, axis=-1)
        bins = np.clip(np.ceil(magnitude / FORCE_MAX * 15), 0, 15).astype(int)
        for level in np.unique(bins):
            color = tuple(CONTACT_CMAP(level / 15))
            node = self.scene.draw_debug_spheres(
                world[bins == level], radius=.0022 if level else .0015, color=color,
            )
            # Keep loaded taxels legible through transparent fingers and in shadow.
            # This is display emphasis only; sensing positions and physics are unchanged.
            for primitive in node.primitives:
                primitive.material.emissiveFactor = np.asarray(color[:3]) * (.8 if level else .03)
            self.nodes.append(node)
