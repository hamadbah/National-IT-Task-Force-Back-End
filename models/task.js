
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      enum: ['1-3 months', '3-6 months', '6-12 months', '1 year or more'],
    },
    status: {
      type: String,
      required: true,
    },
    ministry: 
     [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Ministry'
         }
     ]
    , teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    ]
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;