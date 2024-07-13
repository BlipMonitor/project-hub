import { server } from '../config/stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

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
 * Get ledger data
 * @param {number} sequence - Ledger sequence number
 * @returns {Promise<StellarSdk.Horizon.ServerApi.LedgerRecord>}
 */
const getLedgerData = async (
  sequence: number
): Promise<StellarSdk.Horizon.ServerApi.LedgerRecord> => {
  try {
    const ledgerPage = await server.ledgers().order('desc').limit(1).call();
    const ledger = ledgerPage.records.find((record) => record.sequence === sequence);

    if (!ledger) {
      throw new Error('No ledger record found');
    }

    return ledger;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get ledger data: ${error.message}`);
    }
    throw new Error('Failed to get ledger data: Unknown error');
  }
};

export default {
  getLatestLedger,
  getLatestLedgerSequence,
  getLedgerData
};
