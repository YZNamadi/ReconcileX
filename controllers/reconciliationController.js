const { Op } = require('sequelize');
const Transaction = require('../models/transaction');


exports.generateReconciliationReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query; // Get filter parameters

    // Create filter object
    let filters = {};
    if (startDate && endDate) {
      filters.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)], // Filter by date range
      };
    }
    if (status) {
      filters.status = status; // Filter by status
    }

    // Fetch transactions based on the filter
    const transactions = await Transaction.findAll({
      where: filters,
      order: [['timestamp', 'ASC']], // Order by timestamp for report
    });

    // Example reconciliation logic: Identify discrepancies based on status
    const discrepancies = transactions.filter(tx => tx.status !== 'success'); // Assuming we mark discrepancies based on status

    // Generate the report
    const report = {
      totalTransactions: transactions.length,
      discrepancies: discrepancies.length,
      details: discrepancies.map(tx => ({
        id: tx.id,
        reference: tx.reference,
        amount: tx.amount,
        status: tx.status,
        timestamp: tx.timestamp,
      })),
    };

    return res.status(200).json({
      message: 'Reconciliation report generated successfully',
      report,
    });
  } catch (error) {
    console.error('Error generating reconciliation report:', error);
    return res.status(500).json({
      message: 'Failed to generate reconciliation report',
      error: error.message,
    });
  }
};
