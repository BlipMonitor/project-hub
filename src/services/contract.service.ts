import * as StellarSdk from '@stellar/stellar-sdk';
import { xdr } from '@stellar/stellar-sdk';
import config from '../config/config';
import {
  SorobanContractData,
  ContractState,
  ContractInvocation,
  ContractEvent
} from '../types/soroban';
import { parseContractInvocation, parseContractState } from '../utils/contractParser';
import { storeContractInvocation, storeContractState } from './storage.service';
import eventProcessor from './eventProcessor.service';

/**
 * Get Soroban contract data
 * @param {string} contractId - The Soroban contract ID
 * @returns {Promise<SorobanContractData>}
 */
const getContractData = async (contractId: string): Promise<SorobanContractData> => {
  try {
    const rpcServer = new StellarSdk.rpc.Server(config.stellar.quicknodeRpcUrl);

    const contractCode = await rpcServer.getContractWasmByContractId(contractId);
    const key = xdr.ScVal.scvSymbol('state');
    const contractStateResult = await rpcServer.getContractData(contractId, key);

    const contractState = contractStateResult.val.toXDR('base64');

    const state: ContractState = {
      state: xdr.ScVal.fromXDR(Buffer.from(contractState, 'base64'))
    };

    const parsedState: ContractState = parseContractState(state);

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

export default {
  getContractData,
  handleContractInvocation,
  processContractEvents
};
