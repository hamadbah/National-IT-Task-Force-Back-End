const router = require('express').Router()

const Task = require('../models/task');

// API's/ Routes/ Main Functionality

router.get('/', async(req, res) => {
  const tasks = await Task.find().populate('owner');
  res.render('Task/index.ejs', { tasks });
});

router.get('/new', async (req, res) => {
  res.render('Task/new.ejs');
});

//  add task
router.post('/', async (req, res) => {

  if (req.body.availability === "on") {
    req.body.availability = true;
  } else {
    req.body.availability = false;
  }

  req.body.owner = req.session.user._id;
  await Task.create(req.body);
  res.redirect('/tasks');
});

// router.get("/:taskId", async (req, res) => {
//   const task = await Task.findById(req.params.taskId).populate('owner');

//   const userHasFavorited = task.favoritedByUser.some((user) =>
//     user.equals(req.session.user._id)
//   );

//   res.render('Task/show.ejs', { task, userHasFavorited });
// });

//delete task
router.delete('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (task.owner.equals(req.session.user._id)) {
      await task.deleteOne();
      res.redirect('/tasks');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Edit task
router.get('/:taskId/edit', async (req, res) => {
  try {
    const currentTask = await Task.findById(req.params.taskId);
    res.render('Task/edit.ejs', {
      task: currentTask,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:taskId', async (req, res) => {
  try {

  if (req.body.availability === "on") {
    req.body.availability = true;
  } else {
    req.body.availability = false;
  }

    const currentTask = await Task.findById(req.params.taskId);
    if (currentTask.owner.equals(req.session.user._id)) {
      await currentTask.updateOne(req.body);
      res.redirect('/tasks');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/tasks');
  }
});

// router.post('/:taskId/favorited-by/:userId', async (req, res) => {
//   await Task.findByIdAndUpdate(req.params.taskId, {
//     $push: {favoritedByUser: req.params.userId}
//   });
//   res.redirect(`/tasks/${req.params.taskId}`);
// });

// router.delete('/:taskId/favorited-by/:userId', async (req, res) => {
//   await Task.findByIdAndUpdate(req.params.taskId, {
//     $pull: {favoritedByUser: req.params.userId}
//   });
//   res.redirect(`/tasks/${req.params.taskId}`);
// });

module.exports = router;