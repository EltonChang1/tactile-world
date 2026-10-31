"""Per-taxel force magnitudes, tangential arrows and signed twist arcs."""

import numpy as np
from matplotlib.collections import LineCollection


class TaxelField:
    def __init__(self, ax, grid, side):
        self.xy = grid[:, (0, 2)] * 1000
        x, y = self.xy.T
        self.dots = ax.scatter(x, y, c=np.zeros(len(x)), cmap="viridis", vmin=0, vmax=.35, s=15)
        self.arrows = ax.quiver(x, y, np.zeros(len(x)), np.zeros(len(x)),
                               color="#202938", angles="xy", scale_units="xy", scale=1,
                               width=.003, minlength=0)
        self.arcs = LineCollection([], cmap="coolwarm", linewidths=.9)
        self.arcs.set_clim(-.0002, .0002)
        ax.add_collection(self.arcs)
        self.heads = ax.quiver(x, y, np.zeros(len(x)), np.zeros(len(x)),
                              np.zeros(len(x)), cmap="coolwarm", clim=(-.0002, .0002),
                              angles="xy", scale_units="xy", scale=1, width=.003, minlength=0)
        ax.set(xlim=(-9, 11), ylim=(32, 55), aspect="equal",
               title=f"{side}: 144 taxels • force + twist", xlabel="local x (mm)", ylabel="local z (mm)")
        ax.tick_params(labelsize=8)

    def update(self, force, torque):
        self.dots.set_array(np.linalg.norm(force, axis=-1))
        # Surface projection is x/z. Normal force remains visible in dot color.
        self.arrows.set_UVC(force[:, 0] * 80, force[:, 2] * 80)
        twist = -torque[:, 1]  # right-hand rule about the pad normal (0, -1, 0)
        radius = np.minimum(np.abs(twist) * 4000, .6)
        angle = np.sign(twist)[:, None] * np.linspace(0, 1.5 * np.pi, 16)
        segments = self.xy[:, None, :] + radius[:, None, None] * np.stack((np.cos(angle), np.sin(angle)), axis=-1)
        self.arcs.set_segments(segments)
        self.arcs.set_array(twist)
        self.heads.set_offsets(segments[:, -2])
        delta = segments[:, -1] - segments[:, -2]
        self.heads.set_UVC(delta[:, 0], delta[:, 1], twist)
