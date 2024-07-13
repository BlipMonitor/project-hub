import { ContractEvent } from '../types/soroban';
import { storeContractState } from './storage.service';
import { parseContractState } from '../utils/contractParser';

class EventProcessor {
  /**
   * Process a contract event
   * @param {ContractEvent} event - The contract event data
   * @returns {Promise<void>}
   */
  async processEvent(event: ContractEvent): Promise<void> {
    try {
      const { contractId, data } = event;

      // Assuming the event data contains the contract state
      const state = { [contractId]: data };

      const parsedState = parseContractState(state);

      // Store the parsed state in PostgreSQL
      await storeContractState(parsedState);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to process event: ${error.message}`);
      } else {
        console.error('Failed to process event: Unknown error');
      }
    }
  }
}

export default new EventProcessor();
