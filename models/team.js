const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
name: {
    type: String,
    required: true
  },
  speciality: {
    type: Number,
    required: true
  },
  mobileNo: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  OpeningHours: {
    type: String,
    required: true
  },
  assignedTask: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
})    


const Team = mongoose.model("Team", teamSchema);
module.exports = Team;