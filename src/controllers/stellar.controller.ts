import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { stellarService } from '../services';

const getAccountDetails = catchAsync(async (req, res) => {
  const accountDetails = await stellarService.getAccountDetails(req.params.accountId);
  if (!accountDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  res.send(accountDetails);
});

const getLatestLedger = catchAsync(async (req, res) => {
  const latestLedger = await stellarService.getLatestLedger();
  res.send(latestLedger);
});

const getTransactionDetails = catchAsync(async (req, res) => {
  const transactionDetails = await stellarService.getTransactionDetails(req.params.transactionHash);
  if (!transactionDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transactionDetails);
});

const getSorobanContractData = catchAsync(async (req, res) => {
  const contractData = await stellarService.getSorobanContractData(req.params.contractId);
  res.send(contractData);
});

export default {
  getAccountDetails,
  getLatestLedger,
  getTransactionDetails,
  getSorobanContractData
};
