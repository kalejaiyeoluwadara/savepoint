// routes/clipRoutes.js
const express = require("express");
const {
  getClips,
  getClip,
  createClip,
  updateClip,
  deleteClip,
} = require("../controllers/clipController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getClips).post(createClip);

router.route("/:id").get(getClip).put(updateClip).delete(deleteClip);

module.exports = router;
