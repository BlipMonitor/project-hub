import express from 'express';
import validate from '../../middlewares/validate';
import { stellarValidation } from '../../validations';
import { stellarController } from '../../controllers';

const router = express.Router();

router.get('/account/:accountId', validate(stellarValidation.getAccountDetails), stellarController.getAccountDetails);
router.get('/ledger/latest', stellarController.getLatestLedger);
router.get('/transaction/:transactionHash', validate(stellarValidation.getTransactionDetails), stellarController.getTransactionDetails);

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
