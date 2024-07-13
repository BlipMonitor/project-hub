import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { transactionService } from '../services';

const getTransactionDetails = catchAsync(async (req, res) => {
  const transactionDetails = await transactionService.getTransactionDetails(
    req.params.transactionHash
  );
  if (!transactionDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transactionDetails);
});

const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await transactionService.getAllTransactions();
  res.send(transactions);
});

export default {
  getTransactionDetails,
  getAllTransactions
};
