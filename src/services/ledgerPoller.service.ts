import logger from '../config/logger';
import { ledgerService } from '../services';
import { storeLedgerData } from './storage.service';

class LedgerPoller {
  private lastCheckedSequence: number | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;

  /**
   * Start the ledger polling process
   * @param {number} intervalMs - Polling interval in milliseconds (default: 5000)
   * @returns {Promise<void>}
   */
  async start(intervalMs: number = 5000): Promise<void> {
    if (this.pollingInterval) {
      throw new Error('Ledger polling is already running');
    }

    this.pollingInterval = setInterval(async () => {
      await this.checkForNewLedgers();
    }, intervalMs);

    logger.info('Ledger polling started');
  }

  /**
   * Stop the ledger polling process
   * @returns {void}
   */
  stop(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      logger.info('Ledger polling stopped');
    }
  }

  /**
   * Check for new ledgers and process them
   * @returns {Promise<void>}
   */
  private async checkForNewLedgers(): Promise<void> {
    try {
      const latestSequence = await ledgerService.getLatestLedgerSequence();

      if (this.lastCheckedSequence === null) {
        this.lastCheckedSequence = latestSequence;
        return;
      }

      if (latestSequence > this.lastCheckedSequence) {
        for (let seq = this.lastCheckedSequence + 1; seq <= latestSequence; seq++) {
          await this.processLedger(seq);
        }
        this.lastCheckedSequence = latestSequence;
      }
    } catch (error) {
      logger.error('Error checking for new ledgers:', error);
    }
  }

  /**
   * Process a single ledger
   * @param {number} sequence - Ledger sequence number
   * @returns {Promise<void>}
   */
  private async processLedger(sequence: number): Promise<void> {
    try {
      logger.info(`Processing ledger ${sequence}`);
      // Fetch the ledger data
      const ledgerData = await ledgerService.getLedgerData(sequence);

      // Store the ledger data in the database
      await storeLedgerData(ledgerData);

      // Emit events if necessary
      // Example: eventEmitter.emit('ledgerProcessed', ledgerData);

      logger.info(`Processed ledger ${sequence}`);
    } catch (error) {
      logger.error(`Error processing ledger ${sequence}:`, error);
    }
  }
}

export const ledgerPoller = new LedgerPoller();
