import { xdr } from '@stellar/stellar-sdk';

export interface SorobanContractData {
  contractId: string;
  contractCode: string;
  contractState: ContractState;
}

export interface ContractState {
  [key: string]: xdr.ScVal | any; // Allow for flexibility in the type
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
