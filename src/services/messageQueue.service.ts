import prisma from '../client';

/**
 * Enqueue a message
 * @param {string} content
 * @param {number} priority
 * @returns {Promise<Message>}
 */
const enqueueMessage = async (content: string, priority: number = 0) => {
  return prisma.message.create({
    data: {
      content,
      priority
    }
  });
};

/**
 * Dequeue a message
 * @returns {Promise<Message | null>}
 */
const dequeueMessage = async () => {
  const message = await prisma.message.findFirst({
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
  });

  if (message) {
    await prisma.message.delete({
      where: { id: message.id }
    });
  }

  return message;
};

/**
 * Peek at the next message
 * @returns {Promise<Message | null>}
 */
const peekMessage = async () => {
  return prisma.message.findFirst({
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
  });
};

/**
 * Get queue size
 * @returns {Promise<number>}
 */
const getQueueSize = async (): Promise<number> => {
  return prisma.message.count();
};

export default {
  enqueueMessage,
  dequeueMessage,
  peekMessage,
  getQueueSize
};
