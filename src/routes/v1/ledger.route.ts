import express from 'express';
import { ledgerController } from '../../controllers';

const router = express.Router();

router.get('/latest', ledgerController.getLatestLedger);

export default router;

/**
 * @swagger
 * tags:
 *   name: Ledger
 *   description: Ledger operations
 */

/**
 * @swagger
 * /ledger/latest:
 *   get:
 *     summary: Get latest ledger
 *     description: Retrieve details of the latest ledger.
 *     tags: [Ledger]
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
