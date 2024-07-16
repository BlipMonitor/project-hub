import express from 'express';

import { messageQueueController } from '../../controllers';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { messageQueueValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageQueue'),
    validate(messageQueueValidation.enqueueMessage),
    messageQueueController.enqueueMessage
  )
  .get(auth('manageQueue'), messageQueueController.dequeueMessage);

router.get('/peek', auth('manageQueue'), messageQueueController.peekMessage);
router.get('/size', auth('manageQueue'), messageQueueController.getQueueSize);

export default router;

/**
 * @swagger
 * tags:
 *   name: MessageQueue
 *   description: Message queue management
 */

/**
 * @swagger
 * /message-queue:
 *   post:
 *     summary: Enqueue a message
 *     description: Only users with manage queue permissions can enqueue messages.
 *     tags: [MessageQueue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               priority:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *             example:
 *               content: This is a message
 *               priority: 5
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Dequeue a message
 *     description: Only users with manage queue permissions can dequeue messages.
 *     tags: [MessageQueue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /message-queue/peek:
 *   get:
 *     summary: Peek at the next message
 *     description: Only users with manage queue permissions can peek at messages.
 *     tags: [MessageQueue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /message-queue/size:
 *   get:
 *     summary: Get queue size
 *     description: Only users with manage queue permissions can get the queue size.
 *     tags: [MessageQueue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 size:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
