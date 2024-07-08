import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { messageQueueService } from '../services';

const enqueueMessage = catchAsync(async (req, res) => {
  const { content, priority } = req.body;
  const message = await messageQueueService.enqueueMessage(content, priority);
  res.status(httpStatus.CREATED).send(message);
});

const dequeueMessage = catchAsync(async (req, res) => {
  const message = await messageQueueService.dequeueMessage();
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Queue is empty');
  }
  res.send(message);
});

const peekMessage = catchAsync(async (req, res) => {
  const message = await messageQueueService.peekMessage();
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Queue is empty');
  }
  res.send(message);
});

const getQueueSize = catchAsync(async (req, res) => {
  const size = await messageQueueService.getQueueSize();
  res.send({ size });
});

export default {
  enqueueMessage,
  dequeueMessage,
  peekMessage,
  getQueueSize
};
