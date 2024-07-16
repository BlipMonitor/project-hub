import * as StellarSdk from '@stellar/stellar-sdk';

import prisma from '../client';
import { ContractInvocation, ContractState } from '../types/soroban';
import { serializeScVal } from '../utils/sorobanTypes';

/**
 * Store parsed contract invocation data
 * @param {ContractInvocation} invocation - The parsed contract invocation data
 * @returns {Promise<void>}
 */
export const storeContractInvocation = async (invocation: ContractInvocation): Promise<void> => {
  await prisma.contractInvocation.create({
    data: {
      contractId: invocation.contractId,
      functionName: invocation.functionName,
      args: invocation.args.map((arg) => serializeScVal(arg)) // Convert to JSON-compatible type
    }
  });
};

/**
 * Store parsed contract state data
 * @param {ContractState} state - The parsed contract state data
 * @returns {Promise<void>}
 */
export const storeContractState = async (state: ContractState): Promise<void> => {
  await prisma.contractState.create({
    data: {
      contractId: state.contractId.toString(), // Convert to string
      state: serializeScVal(state.state) // Convert to JSON-compatible type
    }
  });
};

/**
 * Store ledger data
 * @param {StellarSdk.Horizon.ServerApi.LedgerRecord} ledgerData - The ledger data
 * @returns {Promise<void>}
 */
export const storeLedgerData = async (
  ledgerData: StellarSdk.Horizon.ServerApi.LedgerRecord
): Promise<void> => {
  await prisma.ledger.create({
    data: {
      sequence: ledgerData.sequence,
      successfulTransactionCount: ledgerData.successful_transaction_count,
      failedTransactionCount: ledgerData.failed_transaction_count,
      operationCount: ledgerData.operation_count,
      txSetOperationCount: ledgerData.tx_set_operation_count ?? 0, // Provide default value if null
      closedAt: new Date(ledgerData.closed_at),
      totalCoins: ledgerData.total_coins,
      feePool: ledgerData.fee_pool,
      baseFee: ledgerData.base_fee_in_stroops,
      baseReserve: ledgerData.base_reserve_in_stroops,
      maxTxSetSize: ledgerData.max_tx_set_size,
      protocolVersion: ledgerData.protocol_version,
      ledgerHash: ledgerData.hash,
      previousLedgerHash: ledgerData.prev_hash,
      pagingToken: ledgerData.paging_token,
      headerXdr: ledgerData.header_xdr
    }
  });
};
