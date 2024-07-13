import express from 'express';
import validate from '../../middlewares/validate';
import { transactionValidation } from '../../validations';
import { transactionController } from '../../controllers';

const router = express.Router();

router.get(
  '/:transactionHash',
  validate(transactionValidation.getTransactionDetails),
  transactionController.getTransactionDetails
);
router.get('/', transactionController.getAllTransactions);

export default router;

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction operations
 */

/**
 * @swagger
 * /transaction/{transactionHash}:
 *   get:
 *     summary: Get transaction details
 *     description: Retrieve details for a Stellar transaction.
 *     tags: [Transaction]
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
 * /transaction:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve details for all Stellar transactions.
 *     tags: [Transaction]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
