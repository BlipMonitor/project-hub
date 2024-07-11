import { ContractInvocation, ContractState } from '../types/soroban';
import { deserializeScVal } from './sorobanTypes';

/**
 * Parse contract invocation data
 * @param {ContractInvocation} invocation - The contract invocation data
 * @returns {object} Parsed contract invocation data
 */
export function parseContractInvocation(invocation: ContractInvocation): object {
  const { contractId, functionName, args } = invocation;

  const parsedArgs = args.map((arg) => deserializeScVal(arg));

  return {
    contractId,
    functionName,
    args: parsedArgs
  };
}

/**
 * Parse contract state changes
 * @param {ContractState} state - The contract state data
 * @returns {object} Parsed contract state data
 */
export function parseContractState(state: ContractState): object {
  const parsedState: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(state)) {
    parsedState[key] = deserializeScVal(value);
  }

  return parsedState;
}
