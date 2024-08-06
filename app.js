const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const diningRoutes = require('./routes/dining');
const bookingRoutes = require('./routes/booking');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/dining-place', diningRoutes);
app.use('/api/dining-place', bookingRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
