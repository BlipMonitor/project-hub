import * as StellarSdk from '@stellar/stellar-sdk';
import { xdr } from '@stellar/stellar-sdk';
import config from '../config/config';
import { server } from '../config/stellar';
import {
  SorobanContractData,
  ContractState,
  ContractInvocation,
  ContractEvent
} from '../types/soroban';
import { parseContractInvocation, parseContractState } from '../utils/contractParser';
import { storeContractInvocation, storeContractState } from './storage.service';
import eventProcessor from './eventProcessor.service';
import logger from '../config/logger';

/**
 * Get account details
 * @param {string} accountId - The Stellar account ID
 * @returns {Promise<StellarSdk.Horizon.AccountResponse>}
 */
const getAccountDetails = async (
  accountId: string
): Promise<StellarSdk.Horizon.AccountResponse> => {
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
 * Get all accounts
 * @returns {Promise<StellarSdk.Horizon.AccountResponse[]>}
 */
const getAllAccounts = async (): Promise<StellarSdk.Horizon.AccountResponse[]> => {
  try {
    const accounts = await server.accounts().call();
    const accountDetailsPromises = accounts.records.map((account) =>
      server.loadAccount(account.account_id)
    );
    return await Promise.all(accountDetailsPromises);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get all accounts: ${error.message}`);
    }
    throw new Error('Failed to get all accounts: Unknown error');
  }
};

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
 * @returns {Promise<StellarSdk.Horizon.Serv>}
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

/**
 * Get Soroban contract data
 * @param {string} contractId - The Soroban contract ID
 * @returns {Promise<SorobanContractData>}
 */
const getSorobanContractData = async (contractId: string): Promise<SorobanContractData> => {
  try {
    const rpcServer = new StellarSdk.rpc.Server(config.stellar.quicknodeRpcUrl);

    const contractCode = await rpcServer.getContractWasmByContractId(contractId);
    const key = xdr.ScVal.scvSymbol('state');
    const contractStateResult = await rpcServer.getContractData(contractId, key);

    // Extract the correct value from LedgerEntryResult
    const contractState = contractStateResult.val.toXDR('base64'); // Convert to base64 string

    const state: ContractState = {
      state: xdr.ScVal.fromXDR(Buffer.from(contractState, 'base64')) // Convert back to xdr.ScVal
    };

    const parsedState: ContractState = parseContractState(state);

    // Store in PostgreSQL
    await storeContractState(parsedState);

    return {
      contractId,
      contractCode: contractCode.toString('hex'),
      contractState: parsedState
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Soroban contract data: ${error.message}`);
    }
    throw new Error('Failed to get Soroban contract data: Unknown error');
  }
};

/**
 * Handle contract invocation
 * @param {ContractInvocation} invocation - The contract invocation data
 * @returns {Promise<ContractInvocation>} Parsed contract invocation data
 */
const handleContractInvocation = async (
  invocation: ContractInvocation
): Promise<ContractInvocation> => {
  try {
    const parsedData: ContractInvocation = parseContractInvocation(invocation);

    // Store in PostgreSQL
    await storeContractInvocation(parsedData);

    return parsedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to handle contract invocation: ${error.message}`);
    }
    throw new Error('Failed to handle contract invocation: Unknown error');
  }
};

/**
 * Process contract events
 * @param {ContractEvent[]} events - The contract events
 * @returns {Promise<void>}
 */
const processContractEvents = async (events: ContractEvent[]): Promise<void> => {
  for (const event of events) {
    await eventProcessor.processEvent(event);
  }
};

/**
 * Get ledger data
 * @param {number} sequence - Ledger sequence number
 * @returns {Promise<StellarSdk.Horizon.ServerApi.LedgerRecord>}
 */
const getLedgerData = async (
  sequence: number
): Promise<StellarSdk.Horizon.ServerApi.LedgerRecord> => {
  try {
    const ledger = await server.ledgers().ledger(sequence).call();
    logger.info(`Fetched ledger data ${sequence}: ${JSON.stringify(ledger, null, 2)}`);

    if (!ledger || !ledger.records || ledger.records.length === 0) {
      throw new Error('No ledger records found');
    }

    return ledger.records[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get ledger data: ${error.message}`);
    }
    throw new Error('Failed to get ledger data: Unknown error');
  }
};

export default {
  getAccountDetails,
  getAllAccounts,
  getLatestLedger,
  getLatestLedgerSequence,
  getTransactionDetails,
  getAllTransactions,
  getSorobanContractData,
  handleContractInvocation,
  processContractEvents,
  getLedgerData
};
