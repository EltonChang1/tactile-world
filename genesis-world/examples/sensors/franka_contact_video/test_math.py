"""Run with python -m unittest examples.sensors.franka_contact_video.test_math."""

import unittest

import numpy as np

from .scene import pad_wrench, trajectory
from .controls import Controls
from .object_skin import cube_taxels, SIZE


class WrenchTests(unittest.TestCase):
    def test_object_skin_covers_all_six_faces_without_duplicates(self):
        positions, normals = cube_taxels()
        self.assertEqual(positions.shape, (600, 3))
        self.assertEqual(len(np.unique(positions, axis=0)), 600)
        np.testing.assert_allclose(np.linalg.norm(normals, axis=-1), 1)
        np.testing.assert_allclose((positions * normals).sum(axis=-1), SIZE / 2)
        np.testing.assert_allclose(positions.mean(axis=0), 0, atol=1e-15)

    def test_interactive_targets_and_recording(self):
        controls = Controls()
        controls.move(2, -.095)
        controls.grip(-.015)
        controls.rotate(12)
        pos, quat, opening = controls.target()
        np.testing.assert_allclose(pos, [.5, 0, .145])
        self.assertAlmostEqual(opening, .025)
        self.assertAlmostEqual(np.linalg.norm(quat), 1.)
        controls.toggle_recording()
        self.assertFalse(controls.recording)
        controls.toggle_recording()
        self.assertTrue(controls.recording)
        controls.move(2, -5)
        self.assertEqual(controls.pos[2], .12)
        controls.reset()
        np.testing.assert_allclose(controls.pos, [.5, 0, .24])
        controls.stop()
        self.assertFalse(controls.running)

    def test_translation_removes_only_pad_center_lever_arm(self):
        grid = np.array([[0., 0., .04], [.02, 0., .04]])
        force = np.array([[[0., 1., 0.], [0., 3., 0.]]])
        intrinsic = np.array([[[0., .002, 0.], [0., .003, 0.]]])
        torque_at_link = np.cross(grid, force) + intrinsic
        resultant, moment = pad_wrench(force, torque_at_link, grid)
        np.testing.assert_allclose(resultant, [[0, 4, 0]])
        np.testing.assert_allclose(moment, [[0, .005, .02]], atol=1e-12)

    def test_no_contact_means_zero_wrench(self):
        force, moment = pad_wrench(np.zeros((2, 4, 3)), np.zeros((2, 4, 3)), np.ones((4, 3)))
        self.assertFalse(force.any())
        self.assertFalse(moment.any())

    def test_trajectory_returns_to_start_without_discontinuities(self):
        np.testing.assert_allclose(trajectory(0)[0], trajectory(1)[0])
        for knot in (.12, .28, .43, .60, .74, .87):
            np.testing.assert_allclose(trajectory(knot - 1e-7)[0], trajectory(knot + 1e-7)[0], atol=1e-8)


if __name__ == "__main__":
    unittest.main()
