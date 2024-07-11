import { xdr } from '@stellar/stellar-base';
import { ContractInvocation, ContractState } from '../types/soroban';
import { deserializeScVal } from './sorobanTypes';

/**
 * Parse contract invocation data
 * @param {ContractInvocation} invocation - The contract invocation data
 * @returns {ContractInvocation} Parsed contract invocation data
 */
export function parseContractInvocation(invocation: ContractInvocation): ContractInvocation {
  const { contractId, functionName, args } = invocation;

  const parsedArgs = args.map((arg) => deserializeScVal(arg));

  return {
    contractId,
    functionName,
    args: parsedArgs as xdr.ScVal[] // Ensure the correct type
  };
}

/**
 * Parse contract state changes
 * @param {ContractState} state - The contract state data
 * @returns {ContractState} Parsed contract state data
 */
export function parseContractState(state: ContractState): ContractState {
  const parsedState: ContractState = {};

  for (const [key, value] of Object.entries(state)) {
    parsedState[key] = deserializeScVal(value) as xdr.ScVal; // Ensure the correct type
  }

  return parsedState;
}
