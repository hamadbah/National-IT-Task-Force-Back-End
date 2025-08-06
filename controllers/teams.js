const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Team = require("../models/team.js");
const router = express.Router();

// Get all teams
router.get("/", verifyToken, async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create a new team member
router.post("/", verifyToken, async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get a single team by ID
router.get("/:teamId", verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update a team member
router.put("/:teamId", verifyToken, async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.teamId,
      req.body,
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete a team member
router.delete("/:teamId", verifyToken, async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.teamId);
    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(deletedTeam);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
