import { xdr } from '@stellar/stellar-sdk';

export interface SorobanContractData {
  contractId: string;
  contractCode: string;
  contractState: ContractState;
}

export interface ContractState {
  [key: string]: xdr.ScVal;
}

export interface ContractFunction {
  name: string;
  parameters: ContractFunctionParameter[];
  returnType: xdr.ScSpecTypeDef;
}

export interface ContractFunctionParameter {
  name: string;
  type: xdr.ScSpecTypeDef;
}

export interface ContractInteractionData {
  contractId: string;
  operation: string;
  transactionHash: string;
  ledgerSequence: number;
  timestamp: Date;
  parameters: any;
  result: string;
  status: string;
  functionName: string;
}

export interface ContractInvocation {
  contractId: string;
  functionName: string;
  args: xdr.ScVal[];
}

export interface ContractEvent {
  type: string;
  contractId: string;
  topics: string[];
  data: xdr.ScVal;
}

export interface SorobanTransactionData {
  hash: string;
  ledger: number;
  contractInvocation: ContractInvocation;
  events: ContractEvent[];
  result: xdr.ScVal;
}
