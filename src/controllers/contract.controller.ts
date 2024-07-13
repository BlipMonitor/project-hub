import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { contractService } from '../services';

const getContractData = catchAsync(async (req, res) => {
  const contractData = await contractService.getContractData(req.params.contractId);
  res.send(contractData);
});

const handleContractInvocation = catchAsync(async (req, res) => {
  const invocationData = req.body;
  const result = await contractService.handleContractInvocation(invocationData);
  res.send(result);
});

const processContractEvents = catchAsync(async (req, res) => {
  const events = req.body;
  await contractService.processContractEvents(events);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getContractData,
  handleContractInvocation,
  processContractEvents
};
