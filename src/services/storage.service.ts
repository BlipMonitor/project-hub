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
