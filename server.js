require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const redisClient = require('./config/redis');
const Transaction = require('./models/transaction');
const transactionRoutes = require('./routes/transactionRoutes');



const app = express();
app.use(express.json());



// Simple test route
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'ReconcileX server is running' });
});

app.use('/api', transactionRoutes);

// Test DB and Redis connection 
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // creates/updates tables as needed
console.log('Database tables synced');

    console.log('Database connected');

    


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
