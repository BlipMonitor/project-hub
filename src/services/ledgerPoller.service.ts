import { stellarService } from '../services';
import logger from '../config/logger';

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
      const latestSequence = await stellarService.getLatestLedgerSequence();

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
    // TODO: Implement ledger processing logic
    // This could include storing ledger data, emitting events, etc.
    logger.info(`Processing ledger ${sequence}`);
  }
}

export const ledgerPoller = new LedgerPoller();
