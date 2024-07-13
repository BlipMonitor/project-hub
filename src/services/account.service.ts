import { server } from '../config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

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

export default {
  getAccountDetails,
  getAllAccounts
};
