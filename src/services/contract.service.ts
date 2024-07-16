import * as StellarSdk from '@stellar/stellar-sdk';
import { xdr } from '@stellar/stellar-sdk';

// import prisma from '../client';
import config from '../config/config';
import {
  ContractEvent,
  // ContractInteractionData,
  ContractInvocation,
  ContractState,
  SorobanContractData
} from '../types/soroban';
import { parseContractInvocation, parseContractState } from '../utils/contractParser';
import eventProcessor from './eventProcessor.service';
import { storeContractInvocation, storeContractState } from './storage.service';

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

// /**
//  * Log contract interaction
//  * @param {ContractInteractionData} data - The contract interaction data
//  * @returns {Promise<void>}
//  */
// const logContractInteraction = async (data: ContractInteractionData): Promise<void> => {
//   await prisma.contractInteraction.create({ data });
// };

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

    // TODO: Log the contract interaction with dynamic data
    // await logContractInteraction({
    //   contractId: invocation.contractId,
    //   operation: invocation.operation,
    //   transactionHash: invocation.transactionHash,
    //   ledgerSequence: invocation.ledgerSequence,
    //   timestamp: new Date(),
    //   parameters: invocation.args,
    //   result: parsedData.result,
    //   status: parsedData.status,
    //   functionName: invocation.functionName
    // });

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
