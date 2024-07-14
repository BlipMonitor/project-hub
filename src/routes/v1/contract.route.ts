import express from 'express';
import validate from '../../middlewares/validate';
import { contractValidation } from '../../validations';
import { contractController } from '../../controllers';

const router = express.Router();

router.get(
  '/:contractId',
  validate(contractValidation.getContractData),
  contractController.getContractData
);

router.post(
  '/invoke',
  validate(contractValidation.invokeContract),
  contractController.handleContractInvocation
);

router.post(
  '/events',
  validate(contractValidation.processContractEvents),
  contractController.processContractEvents
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Contract operations
 */

/**
 * @swagger
 * /contract/{contractId}:
 *   get:
 *     summary: Get Soroban contract data
 *     description: Retrieve data for a Soroban contract.
 *     tags: [Contract]
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Soroban contract ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContractData'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /contract/invoke:
 *   post:
 *     summary: Handle contract invocation
 *     description: Handle contract invocation.
 *     tags: [Contract]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ContractInvocation'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContractInvocation'
 */

/**
 * @swagger
 * /contract/events:
 *   post:
 *     summary: Process contract events
 *     description: Process contract events.
 *     tags: [Contract]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ContractEvent'
 *     responses:
 *       "204":
 *         description: No Content
 */
