import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { accountService } from '../services';

const getAccountDetails = catchAsync(async (req, res) => {
  const accountDetails = await accountService.getAccountDetails(req.params.accountId);
  if (!accountDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  res.send(accountDetails);
});

const getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await accountService.getAllAccounts();
  res.send(accounts);
});

export default {
  getAccountDetails,
  getAllAccounts
};
