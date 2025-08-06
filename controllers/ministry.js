const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Ministry = require("../models/ministry.js");
const router = express.Router();

//creating the Ministry using CRUD. 
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.Owner = req.user._id;
    const ministry = await Ministry.create(req.body);
    await ministry.populate('Owner')
    res.status(201).json(ministry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//implementing the read 
router.get("/", verifyToken, async (req, res) => {
  try {
    const ministries = await Ministry.find({})
      .populate("Owner")
      .sort({ createdAt: "desc" });//decending order. from newest to oldest
    res.status(200).json(ministries);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//populating the owner of ministry 
router.get('/:ministryId', verifyToken, async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.ministryId).populate([
      'Owner',
    ]);
    res.status(200).json(ministry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:ministryId", verifyToken, async (req, res) => {
  try {
    // Find the ministry using the ID
    const ministry = await Ministry.findById(req.params.ministryId);

    // Checking the permissions:
    if (!ministry.Owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    // Update Ministry:
    const updatedMinistry = await Ministry.findByIdAndUpdate(
      req.params.ministryId,
      req.body,
      { new: true }
    );
    updatedMinistry = await updatedMinistry.populate('Owner')


    // Issue JSON response:
    res.status(200).json(updatedMinistry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:ministryId", verifyToken, async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.ministryId);

    if (!ministry.Owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedMinistry = await Ministry.findByIdAndDelete(req.params.ministryId);
    res.status(200).json(deletedMinistry);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;