"""Two large 3D panels with a shared contact-color legend."""
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from matplotlib.cm import ScalarMappable
from matplotlib.colors import Normalize
from .object_skin import FORCE_MAX, CONTACT_CMAP

FRAME_SIZE = (1600, 800)


class ObjectDashboard:
    def __init__(self):
        self.figure = Figure(figsize=(16, 8), dpi=100, facecolor='#f4f6fa')
        self.canvas = FigureCanvasAgg(self.figure)
        layout = self.figure.add_gridspec(1, 2, left=.025, right=.975, bottom=.17,
                                          top=.85, wspace=.035)
        self.title = self.figure.suptitle('Tactile grasp', fontsize=27, y=.97)
        self.images = []
        for i, name in enumerate(('Robot grasp', 'Contact on the object • 600 sensing balls')):
            ax = self.figure.add_subplot(layout[0, i])
            self.images.append(ax.imshow(np.zeros((600, 800, 3), dtype=np.uint8)))
            ax.set_title(name, fontsize=21, pad=12)
            ax.set_axis_off()
        cax = self.figure.add_axes([.25, .105, .5, .025])
        bar = self.figure.colorbar(
            ScalarMappable(norm=Normalize(0, FORCE_MAX), cmap=CONTACT_CMAP),
            cax=cax, orientation='horizontal',
        )
        bar.ax.tick_params(labelsize=15)
        bar.set_label('Contact force per ball (N) • blue = zero; red = high', fontsize=17, labelpad=7)
        self.figure.text(.5, .013, 'Simulated tactile readings • uncalibrated',
                         ha='center', fontsize=13, color='#526070')

    def frame(self, rgb, time, phase, lift):
        self.title.set_text(f'{phase}   |   {time:.2f} s   |   Lift: {lift * 1000:.0f} mm')
        for image, data in zip(self.images, rgb):
            image.set_data(data)
        self.canvas.draw()
        return np.asarray(self.canvas.buffer_rgba())[..., :3].copy()
