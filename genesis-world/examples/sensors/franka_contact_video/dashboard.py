"""Offline Matplotlib dashboard and streaming MP4 writer."""

import av
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from matplotlib.ticker import FuncFormatter

from .field import TaxelField


class Dashboard:
    def __init__(self, seconds, grid_size, grid):
        self.seconds = seconds
        self.figure = Figure(figsize=(16, 12), dpi=100, facecolor="#f5f7fa")
        self.canvas = FigureCanvasAgg(self.figure)
        layout = self.figure.add_gridspec(4, 4, left=.055, right=.92, bottom=.08, top=.90,
                                          hspace=.70, wspace=.50, height_ratios=(1.25, 1.3, .8, .8))
        self.title = self.figure.suptitle("Franka tactile contact", fontsize=19)
        self.images = []
        for col, title in ((0, "One arm / one fixed sphere"), (1, "Contact close-up • colors = depth")):
            ax = self.figure.add_subplot(layout[0, col])
            self.images.append(ax.imshow(np.zeros((480, 640, 3), dtype=np.uint8)))
            ax.set_title(title, fontsize=10)
            ax.set_axis_off()
        self.maps = []
        for col, side in ((2, "Left"), (3, "Right")):
            ax = self.figure.add_subplot(layout[0, col])
            im = ax.imshow(np.zeros((grid_size, grid_size)), origin="lower", cmap="inferno",
                           vmin=0, vmax=4, extent=(-6, 8, 35, 52), aspect="auto")
            ax.set_title(f"{side} fingertip contact map", fontsize=10)
            ax.set_xlabel("local x (mm)", fontsize=9)
            ax.set_ylabel("local z (mm)", fontsize=9)
            self.figure.colorbar(im, ax=ax, label="probe depth (mm)", fraction=.06)
            self.maps.append(im)
        self.fields = []
        for side in range(2):
            field_layout = layout[1, side * 2:side * 2 + 2].subgridspec(1, 3, width_ratios=(8, .25, .25), wspace=.65)
            ax = self.figure.add_subplot(field_layout[0, 0])
            field = TaxelField(ax, grid, ("Left", "Right")[side])
            self.figure.colorbar(field.dots, cax=self.figure.add_subplot(field_layout[0, 1]), label="|F| per taxel (N)")
            self.figure.colorbar(field.arcs, cax=self.figure.add_subplot(field_layout[0, 2]), label="normal twist (mN·m)", format=FuncFormatter(lambda value, _: f"{value * 1000:.1f}"))
            self.fields.append(field)
        self.axes, self.lines = [], []
        for row, quantity, unit in ((2, "Force", "N"), (3, "Torque about pad center", "N·m")):
            for side in range(2):
                ax = self.figure.add_subplot(layout[row, side * 2:side * 2 + 2])
                ax.set_title(f"{('Left', 'Right')[side]} • {quantity}", fontsize=11)
                ax.set_xlim(0, seconds)
                ax.set_xlabel("simulation time (s)", fontsize=9)
                ax.set_ylabel(unit)
                ax.grid(alpha=.25)
                lines = [ax.plot([], [], color=color, label=axis, linewidth=1.5)[0]
                         for axis, color in zip(("x", "y", "z"), ("#d1495b", "#16826c", "#296bc0"))]
                ax.legend(loc="upper right", ncol=3, fontsize=8)
                self.axes.append(ax)
                self.lines.append(lines)
        self.figure.text(.5, .018,
                         "Uncalibrated KinematicTaxel estimates • each finger's local frame • fixed 12 × 12 taxel grids",
                         ha="center", fontsize=10, color="#526070")

    def frame(self, rgb, depth, times, forces, torques, phase, taxel_force, taxel_torque):
        self.title.set_text(f"Franka tactile contact   |   {phase}   |   {times[-1]:.2f} s")
        for im, data in zip(self.images, rgb):
            im.set_data(data)
        for im, data in zip(self.maps, depth):
            im.set_data(data.reshape(im.get_array().shape) * 1000)
        for field, force, torque in zip(self.fields, taxel_force, taxel_torque):
            field.update(force, torque)
        for i, (ax, lines) in enumerate(zip(self.axes, self.lines)):
            values = (forces if i < 2 else torques)[:, i % 2]
            for component, line in enumerate(lines):
                line.set_data(times, values[:, component])
            ax.set_xlim(max(0, times[-1] - 20), max(self.seconds, times[-1]))
            ax.relim()
            ax.autoscale_view(scalex=False, scaley=True)
        self.canvas.draw()
        return np.asarray(self.canvas.buffer_rgba())[..., :3].copy()


class Movie:
    def __init__(self, path, fps, size=(1600, 1200)):
        self.container = av.open(str(path), "w")
        self.stream = self.container.add_stream("libx264", rate=fps)
        self.stream.width, self.stream.height = size
        self.stream.pix_fmt = "yuv420p"
        self.stream.options = {"crf": "20", "preset": "fast"}

    def write(self, rgb):
        for packet in self.stream.encode(av.VideoFrame.from_ndarray(rgb, format="rgb24")):
            self.container.mux(packet)

    def close(self):
        try:
            for packet in self.stream.encode():
                self.container.mux(packet)
        finally:
            self.container.close()
