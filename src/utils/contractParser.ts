import { ContractInvocation } from '../types/soroban';
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
