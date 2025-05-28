

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Transaction extends Model {}


Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., fincra, paystack, kora',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'NGN',
    },
    status: {
      type: DataTypes.ENUM('success', 'pending', 'failed'),
      defaultValue: 'pending',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isDuplicate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true, 
  }
);

module.exports = Transaction;
