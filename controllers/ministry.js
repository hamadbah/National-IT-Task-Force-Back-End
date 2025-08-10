const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Ministry = require("../models/ministry.js");
const Task = require('../models/task.js');
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.Owner = req.user._id;
    const ministry = await Ministry.create(req.body);
    res.status(201).json(ministry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const ministries = await Ministry.find({}).populate('tasks');
    res.status(200).json(ministries);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:ministryId', verifyToken, async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.ministryId).populate('tasks');
    res.status(200).json(ministry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:ministryId", verifyToken, async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.ministryId);
    if (!ministry.Owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const updatedMinistry = await Ministry.findByIdAndUpdate(
      req.params.ministryId,
      req.body,
      { new: true }
    );
    updatedMinistry = await updatedMinistry.populate('Owner')
    res.status(200).json(updatedMinistry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:ministryId", verifyToken, async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.ministryId);
    await Task.deleteMany({ ministry: { $in: [req.params.ministryId] } });
    const deletedMinistry = await Ministry.findByIdAndDelete(req.params.ministryId);
    res.status(200).json(deletedMinistry);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

router.put("/:ministryId/tasks", verifyToken, async (req, res) => {
  try {
    const { taskIds } = req.body;
    if (!Array.isArray(taskIds)) {
      return res.status(400).json({ err: "taskIds must be an array" });
    }
    const ministry = await Ministry.findById(req.params.ministryId);
    if (!ministry) {
      return res.status(404).json({ err: "Ministry not found" });
    }
    ministry.tasks = taskIds;
    await ministry.save();
    await ministry.populate('tasks');
    res.status(200).json(ministry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;