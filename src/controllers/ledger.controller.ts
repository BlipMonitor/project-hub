import catchAsync from '../utils/catchAsync';
import { ledgerService } from '../services';

const getLatestLedger = catchAsync(async (req, res) => {
  const latestLedger = await ledgerService.getLatestLedger();
  res.send(latestLedger);
});

export default {
  getLatestLedger
};
