import express from 'express';
import validate from '../../middlewares/validate';
import { accountValidation } from '../../validations';
import { accountController } from '../../controllers';

const router = express.Router();

router.get('/', validate(accountValidation.getAllAccounts), accountController.getAllAccounts);

router.get(
  '/:accountId',
  validate(accountValidation.getAccountDetails),
  accountController.getAccountDetails
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account operations
 */

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get all accounts
 *     description: Retrieve details for all Stellar accounts.
 *     tags: [Account]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /account/{accountId}:
 *   get:
 *     summary: Get account details
 *     description: Retrieve details for a Stellar account.
 *     tags: [Account]
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
