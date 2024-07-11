import * as StellarSdk from '@stellar/stellar-sdk';
import { server } from '../config/stellar';
import { xdr, Contract } from '@stellar/stellar-sdk';
import { SorobanContractData, ContractFunction, SorobanTransactionData } from '../types/soroban';
import { serializeScVal, deserializeScVal } from '../utils/sorobanTypes';

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
 * TODO: Get all transactions
 */

/**
 * Get Soroban contract data
 * @param {string} contractId - The Soroban contract ID
 * @returns {Promise<SorobanContractData>}
 */
const getSorobanContractData = async (contractId: string): Promise<SorobanContractData> => {
  try {
    // const contract = new Contract(contractId);
    const contractCode = await server.getContractCode(contractId);
    const contractState = await server.getContractData(contractId);

    return {
      contractId,
      contractCode: contractCode.toString('hex'),
      contractState: contractState.reduce(
        (acc, entry) => {
          acc[entry.key.toString()] = entry.val;
          return acc;
        },
        {} as Record<string, xdr.ScVal>
      )
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Soroban contract data: ${error.message}`);
    }
    throw new Error('Failed to get Soroban contract data: Unknown error');
  }
};

/**
 * Get Soroban contract functions
 * @param {string} contractId - The Soroban contract ID
 * @returns {Promise<ContractFunction[]>}
 */
const getSorobanContractFunctions = async (contractId: string): Promise<ContractFunction[]> => {
  try {
    const contract = new Contract(contractId);
    const functions = await contract.getFunctions();

    return functions.map((func: any) => ({
      name: func.name,
      parameters: func.parameters.map((param: any) => ({
        name: param.name,
        type: param.type
      })),
      returnType: func.returnType
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Soroban contract functions: ${error.message}`);
    }
    throw new Error('Failed to get Soroban contract functions: Unknown error');
  }
};

/**
 * Invoke Soroban contract function
 * @param {string} contractId - The Soroban contract ID
 * @param {string} functionName - The function name to invoke
 * @param {xdr.ScVal[]} args - The function arguments
 * @returns {Promise<SorobanTransactionData>}
 */
const invokeSorobanContractFunction = async (
  contractId: string,
  functionName: string,
  args: any[]
): Promise<SorobanTransactionData> => {
  try {
    const contract = new Contract(contractId);
    const serializedArgs = args.map(serializeScVal);
    const transaction = await contract.call(functionName, ...serializedArgs);
    const result = await server.submitTransaction(transaction);

    return {
      hash: result.hash,
      ledger: result.ledger,
      contractInvocation: {
        contractId,
        functionName,
        args: serializedArgs
      },
      events: result.events.map((event: any) => ({
        type: event.type,
        contractId: event.contractId,
        topics: event.topics,
        data: deserializeScVal(event.data)
      })),
      result: deserializeScVal(result.returnValue)
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to invoke Soroban contract function: ${error.message}`);
    }
    throw new Error('Failed to invoke Soroban contract function: Unknown error');
  }
};

export default {
  getAccountDetails,
  getLatestLedger,
  getLatestLedgerSequence,
  getTransactionDetails,
  getSorobanContractData,
  getSorobanContractFunctions,
  invokeSorobanContractFunction
};
