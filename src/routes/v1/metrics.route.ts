import express from 'express';
import validate from '../../middlewares/validate';
import { metricsValidation } from '../../validations';
import { metricsController } from '../../controllers';

const router = express.Router();

router.get(
  '/transaction-volume',
  validate(metricsValidation.getTransactionVolume),
  metricsController.getTransactionVolume
);

router.get('/error-rate', validate(metricsValidation.getErrorRate), metricsController.getErrorRate);

router.get('/gas-usage', validate(metricsValidation.getGasUsage), metricsController.getGasUsage);

router.get(
  '/unique-users',
  validate(metricsValidation.getUniqueUsers),
  metricsController.getUniqueUsers
);

router.get(
  '/response-time',
  validate(metricsValidation.getResponseTime),
  metricsController.getResponseTime
);

router.post(
  '/record-transaction',
  validate(metricsValidation.recordTransaction),
  metricsController.recordTransaction
);

router.post(
  '/record-error',
  validate(metricsValidation.recordError),
  metricsController.recordError
);

router.post(
  '/record-gas-usage',
  validate(metricsValidation.recordGasUsage),
  metricsController.recordGasUsage
);

router.post(
  '/record-user-interaction',
  validate(metricsValidation.recordUserInteraction),
  metricsController.recordUserInteraction
);

router.post(
  '/record-response-time',
  validate(metricsValidation.recordResponseTime),
  metricsController.recordResponseTime
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Metrics operations
 */

/**
 * @swagger
 * /metrics/transaction-volume:
 *   get:
 *     summary: Get transaction volume
 *     description: Retrieve transaction volume for a contract.
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *         description: Time range
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 volume:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/error-rate:
 *   get:
 *     summary: Get error rate
 *     description: Retrieve error rate for a contract.
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *         description: Time range
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorRate:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/gas-usage:
 *   get:
 *     summary: Get gas usage
 *     description: Retrieve gas usage for a contract.
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *         description: Time range
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGas:
 *                   type: number
 *                 averageGas:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/unique-users:
 *   get:
 *     summary: Get unique users
 *     description: Retrieve unique users for a contract.
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *         description: Time range
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uniqueUsers:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/response-time:
 *   get:
 *     summary: Get response time
 *     description: Retrieve response time for a contract.
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *         description: Time range
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageResponseTime:
 *                   type: number
 *                 totalResponseTime:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/record-transaction:
 *   post:
 *     summary: Record transaction
 *     description: Record a transaction for a contract.
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *                 description: Contract ID
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/record-error:
 *   post:
 *     summary: Record error
 *     description: Record an error for a contract.
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *                 description: Contract ID
 *               errorType:
 *                 type: string
 *                 description: Error type
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/record-gas-usage:
 *   post:
 *     summary: Record gas usage
 *     description: Record gas usage for a contract.
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *                 description: Contract ID
 *               gasUsed:
 *                 type: number
 *                 description: Gas used
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/record-user-interaction:
 *   post:
 *     summary: Record user interaction
 *     description: Record a user interaction for a contract.
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *                 description: Contract ID
 *               userAddress:
 *                 type: string
 *                 description: User address
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /metrics/record-response-time:
 *   post:
 *     summary: Record response time
 *     description: Record response time for a contract.
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *                 description: Contract ID
 *               responseTime:
 *                 type: number
 *                 description: Response time
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
