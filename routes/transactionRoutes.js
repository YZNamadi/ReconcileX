const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { generateReconciliationReport } = require('../controllers/reconciliationController');

// Create a new transaction
router.post('/transactions', transactionController.createTransaction);


// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Get transaction by reference
router.get('/transactions/:reference', transactionController.getTransactionByReference);

// Generate reconciliation report
router.get('/transactions/reconciliation/report', generateReconciliationReport);

router.put('/transactions/:reference/status', transactionController.updateTransactionStatus);


module.exports = router;
