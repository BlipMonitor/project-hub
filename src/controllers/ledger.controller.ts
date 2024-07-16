import { ledgerService } from '../services';
import catchAsync from '../utils/catchAsync';

const getLatestLedger = catchAsync(async (req, res) => {
  const latestLedger = await ledgerService.getLatestLedger();
  res.send(latestLedger);
});

export default {
  getLatestLedger
};
