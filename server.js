const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const PORT = process.env.PORT || 3000


const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// middleware:cd ...

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// All Routes: 

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/products',productsRouter)

app.listen(PORT, () => {
  console.log('The express app is ready!');
});