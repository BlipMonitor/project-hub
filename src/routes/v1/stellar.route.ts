import express from 'express';
import validate from '../../middlewares/validate';
import { stellarValidation } from '../../validations';
import { stellarController } from '../../controllers';

const router = express.Router();

router.get(
  '/account/:accountId',
  validate(stellarValidation.getAccountDetails),
  stellarController.getAccountDetails
);
router.get('/ledger/latest', stellarController.getLatestLedger);
router.get(
  '/transaction/:transactionHash',
  validate(stellarValidation.getTransactionDetails),
  stellarController.getTransactionDetails
);
router.get(
  '/soroban/contract/:contractId',
  validate(stellarValidation.getSorobanContractData),
  stellarController.getSorobanContractData
);
router.post(
  '/soroban/contract/invoke',
  validate(stellarValidation.invokeContract),
  stellarController.handleContractInvocation
);
router.post('/soroban/contract/events', stellarController.processContractEvents);

export default router;

/**
 * @swagger
 * tags:
 *   name: Stellar
 *   description: Stellar network operations
 */

/**
 * @swagger
 * /stellar/account/{accountId}:
 *   get:
 *     summary: Get account details
 *     description: Retrieve details for a Stellar account.
 *     tags: [Stellar]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Stellar account ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /stellar/ledger/latest:
 *   get:
 *     summary: Get latest ledger
 *     description: Retrieve details of the latest ledger.
 *     tags: [Stellar]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ledger'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /stellar/transaction/{transactionHash}:
 *   get:
 *     summary: Get transaction details
 *     description: Retrieve details for a Stellar transaction.
 *     tags: [Stellar]
 *     parameters:
 *       - in: path
 *         name: transactionHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Stellar transaction hash
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /stellar/soroban/contract/{contractId}:
 *   get:
 *     summary: Get Soroban contract data
 *     description: Retrieve data for a Soroban contract.
 *     tags: [Stellar]
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
 *               $ref: '#/components/schemas/SorobanContractData'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /stellar/soroban/contract/invoke:
 *   post:
 *     summary: Handle contract invocation
 *     description: Handle contract invocation.
 *     tags: [Stellar]
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
 * /stellar/soroban/contract/events:
 *   post:
 *     summary: Process contract events
 *     description: Process contract events.
 *     tags: [Stellar]
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
