const mongoose = require('mongoose');

const ministrySchema = new mongoose.Schema({
name: {
    type: String,
    required: true
  },
  Phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  OpeningHours: {
    type: String,
    required: true
  },
  Owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
})    




const Ministry = mongoose.model("Ministry", ministrySchema);
module.exports = Ministry;