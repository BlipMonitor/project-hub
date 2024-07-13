import { server } from '../config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

/**
 * Get transaction details
 * @param {string} transactionHash - The transaction hash
 * @returns {Promise<StellarSdk.Horizon.ServerApi.TransactionRecord>}
 */
const getTransactionDetails = async (
  transactionHash: string
): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord> => {
  try {
    const transaction = await server.transactions().transaction(transactionHash).call();
    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get transaction details: ${error.message}`);
    }
    throw new Error('Failed to get transaction details: Unknown error');
  }
};

/**
 * Get all transactions
 * @returns {Promise<StellarSdk.Horizon.ServerApi.TransactionRecord[]>}
 */
const getAllTransactions = async (): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord[]> => {
  try {
    const transactions = await server.transactions().call();
    return transactions.records;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get all transactions: ${error.message}`);
    }
    throw new Error('Failed to get all transactions: Unknown error');
  }
};

export default {
  getTransactionDetails,
  getAllTransactions
};
