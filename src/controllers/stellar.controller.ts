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

const getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await stellarService.getAllAccounts();
  res.send(accounts);
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

const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await stellarService.getAllTransactions();
  res.send(transactions);
});

const getSorobanContractData = catchAsync(async (req, res) => {
  const contractData = await stellarService.getSorobanContractData(req.params.contractId);
  res.send(contractData);
});

const handleContractInvocation = catchAsync(async (req, res) => {
  const invocationData = req.body;
  const result = await stellarService.handleContractInvocation(invocationData);
  res.send(result);
});

const processContractEvents = catchAsync(async (req, res) => {
  const events = req.body;
  await stellarService.processContractEvents(events);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getAccountDetails,
  getAllAccounts,
  getLatestLedger,
  getTransactionDetails,
  getAllTransactions,
  getSorobanContractData,
  handleContractInvocation,
  processContractEvents
};
