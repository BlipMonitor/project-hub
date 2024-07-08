import * as StellarSdk from '@stellar/stellar-sdk';
import config from './config';

export const server = new StellarSdk.Horizon.Server(config.stellar.quicknodeRpcUrl);
