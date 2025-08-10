const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Task = require("../models/task.js");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('ministry');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:taskId", verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:taskId", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
