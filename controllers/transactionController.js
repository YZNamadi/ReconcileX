const { Op } = require('sequelize');
const redisClient = require('../config/redis');
const Transaction = require('../models/transaction');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { id, amount, status, reference, source, currency, timestamp } = req.body;

    // Check if transaction with the same ID already exists
    const existing = await Transaction.findOne({ where: { id } });
    if (existing) {
      return res.status(409).json({ message: 'Transaction with this ID already exists' });
    }

    // Check for potential duplicates (same ref, amount, source, ±60s timestamp)
    const duplicate = await Transaction.findOne({
      where: {
        reference,
        amount,
        source,
        timestamp: {
          [Op.between]: [
            new Date(new Date(timestamp).getTime() - 60000), // 60s before
            new Date(new Date(timestamp).getTime() + 60000), // 60s after
          ],
        },
      },
    });

    const isDuplicate = !!duplicate;

    // Create transaction with duplicate status
    const transaction = await Transaction.create({
      id,
      amount,
      status,
      reference,
      source,
      currency,
      timestamp,
      isDuplicate,
    });

    // Invalidate Redis cache for this reference if it exists
    const cacheKey = `transaction:${reference}`;
    await redisClient.del(cacheKey);

    return res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all transactions (descending by creation time)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get transaction by reference (cache-first approach)
exports.getTransactionByReference = async (req, res) => {
  const { reference } = req.params;

  try {
    const cacheKey = `transaction:${reference}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        message: 'Transaction fetched from cache',
        transaction: JSON.parse(cached),
      });
    }

    const transaction = await Transaction.findOne({ where: { reference } });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await redisClient.set(cacheKey, JSON.stringify(transaction), 'EX', 3600); // cache 1 hour

    return res.status(200).json({
      message: 'Transaction fetched from DB',
      transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// transactionController.js

exports.updateTransactionStatus = async (req, res) => {
    const { reference } = req.params;
    const { status } = req.body;
  
    try {
      const transaction = await Transaction.findOne({ where: { reference } });
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Update the status
      transaction.status = status;
      await transaction.save();
  
      return res.status(200).json({ message: 'Transaction status updated', transaction });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  