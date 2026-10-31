"""Keyboard targets shared by the interactive simulation and its focused tests."""

import numpy as np

import genesis.utils.geom as gu
from genesis.vis.keybindings import Key, KeyAction, Keybind


class Controls:
    def __init__(self):
        self.running = True
        self.recording = True
        self.reset()

    def reset(self):
        self.pos = np.array([.5, 0., .24])
        self.yaw = 0.
        self.opening = .04

    def move(self, axis, delta):
        self.pos[axis] += delta
        self.pos = np.clip(self.pos, [.25, -.20, .12], [.70, .20, .40])

    def rotate(self, delta):
        self.yaw = np.clip(self.yaw + delta, -45, 45)

    def grip(self, delta):
        self.opening = np.clip(self.opening + delta, 0, .04)

    def toggle_recording(self):
        self.recording = not self.recording
        print("Recording resumed" if self.recording else "Recording paused", flush=True)

    def stop(self):
        self.running = False

    def target(self):
        return self.pos, gu.euler_to_quat((0, 180, self.yaw)), self.opening

    def bind(self, viewer):
        bindings = []
        for key, axis, delta in ((Key.UP, 0, -.001), (Key.DOWN, 0, .001),
                                  (Key.LEFT, 1, -.001), (Key.RIGHT, 1, .001),
                                  (Key.J, 2, -.001), (Key.K, 2, .001)):
            bindings.append(Keybind(f"contact_move_{key.name}", key, KeyAction.HOLD,
                                    callback=self.move, args=(axis, delta)))
        for key, callback, arg in ((Key.N, self.rotate, 1.), (Key.M, self.rotate, -1.),
                                    (Key.C, self.grip, -.0005), (Key.O, self.grip, .0005)):
            bindings.append(Keybind(f"contact_{key.name}", key, KeyAction.HOLD, callback=callback, args=(arg,)))
        for key, callback in ((Key.BACKSLASH, self.reset), (Key.F8, self.toggle_recording),
                               (Key.ESCAPE, self.stop)):
            bindings.append(Keybind(f"contact_{key.name}", key, KeyAction.RELEASE, callback=callback))
        viewer.register_keybinds(*bindings)
