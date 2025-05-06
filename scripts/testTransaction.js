const Transaction = require('../models/transaction');

async function createSample() {
  try {
    const tx = await Transaction.create({
      reference: 'TXN_001',
      source: 'paystack',
      amount: 15000,
      currency: 'NGN',
      status: 'success',
      timestamp: new Date(),
    });

    console.log('Transaction created:', tx.toJSON());
  } catch (err) {
    console.error('Error creating transaction:', err.message);
  }
}

createSample();
