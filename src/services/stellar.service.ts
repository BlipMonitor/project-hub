import * as StellarSdk from '@stellar/stellar-sdk';
import { server } from '../config/stellar';

/**
 * Get account details
 * @param {string} accountId - The Stellar account ID
 * @returns {Promise<StellarSdk.Horizon.AccountResponse>}
 */
const getAccountDetails = async (accountId: string): Promise<StellarSdk.Horizon.AccountResponse> => {
  try {
    const account = await server.loadAccount(accountId);
    return account;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get account details: ${error.message}`);
    }
    throw new Error('Failed to get account details: Unknown error');
  }
};

/**
 * TODO: Get all accounts
 */

/**
 * Get latest ledger
 * @returns {Promise<StellarSdk.Horizon.ServerApi.LedgerRecord>}
 */
const getLatestLedger = async (): Promise<StellarSdk.Horizon.ServerApi.LedgerRecord> => {
  try {
    const ledger = await server.ledgers().order('desc').limit(1).call();
    return ledger.records[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get latest ledger: ${error.message}`);
    }
    throw new Error('Failed to get latest ledger: Unknown error');
  }
};

/**
 * Get the latest ledger sequence number
 * @returns {Promise<number>} Latest ledger sequence number
 */
const getLatestLedgerSequence = async (): Promise<number> => {
  try {
    const latestLedger = await server.ledgers().order('desc').limit(1).call();
    return latestLedger.records[0].sequence;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get latest ledger sequence: ${error.message}`);
    }
    throw new Error('Failed to get latest ledger sequence: Unknown error');
  }
};

/**
 * Get transaction details
 * @param {string} transactionHash - The transaction hash
 * @returns {Promise<StellarSdk.Horizon.ServerApi.TransactionRecord>}
 */
const getTransactionDetails = async (transactionHash: string): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord> => {
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
 * TODO: Get all transactions
 */

export default {
  getAccountDetails,
  getLatestLedger,
  getLatestLedgerSequence,
  getTransactionDetails,
};
