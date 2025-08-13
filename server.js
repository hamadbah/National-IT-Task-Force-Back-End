const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Control Live Demo
const allowedOrigins = [
  'http://localhost:5173',
  'https://nationaltf.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
));
app.use(express.json());
app.use(logger('dev'));

const testJwtRouter = require('./controllers/test-jwt');
const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/users');
const teamRouter = require('./controllers/teams');
const tasksRouter = require("./controllers/tasks.js");
const ministryRouter = require('./controllers/ministry');

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/teams', teamRouter);
app.use('/tasks', tasksRouter);
app.use('/ministries', ministryRouter);


app.listen(3000, () => {
  console.log('The express app is ready and running on port 3000!');
});
