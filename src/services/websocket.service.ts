import WebSocket from 'ws';
import http from 'http';
import logger from '../config/logger';
import { stellarService } from '../services';

/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 * @returns {WebSocket.Server} WebSocket server instance
 */
const initializeWebSocketServer = (server: http.Server): WebSocket.Server => {
  const wss = new WebSocket.Server({ server });
  logger.info('WebSocket server initialized');
  return wss;
};

/**
 * Handle new WebSocket connection
 * @param {WebSocket} ws - WebSocket connection
 * @param {Set<WebSocket>} clients - Set of connected clients
 */
const handleConnection = (ws: WebSocket, clients: Set<WebSocket>): void => {
  clients.add(ws);
  logger.info('New WebSocket connection established');

  ws.on('message', (message: string) => handleMessage(ws, message));
  ws.on('close', () => handleDisconnection(ws, clients));
  ws.on('error', (error: Error) => logger.error('WebSocket error:', error));

  sendLatestLedger(ws);
};

/**
 * Handle WebSocket message
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} message - Received message
 */
const handleMessage = (ws: WebSocket, message: string): void => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'subscribe' && data.event === 'ledger') {
      logger.info('Client subscribed to ledger updates');
    }
  } catch (error) {
    logger.error('Error parsing WebSocket message:', error);
  }
};

/**
 * Handle WebSocket disconnection
 * @param {WebSocket} ws - WebSocket connection
 * @param {Set<WebSocket>} clients - Set of connected clients
 */
const handleDisconnection = (ws: WebSocket, clients: Set<WebSocket>): void => {
  clients.delete(ws);
  logger.info('WebSocket connection closed');
};

/**
 * Send latest ledger data to a WebSocket client
 * @param {WebSocket} ws - WebSocket connection
 */
const sendLatestLedger = async (ws: WebSocket): Promise<void> => {
  try {
    const latestLedger = await stellarService.getLatestLedger();
    ws.send(JSON.stringify({ type: 'ledger', data: latestLedger }));
  } catch (error) {
    logger.error('Error sending latest ledger:', error);
  }
};

/**
 * Start streaming ledger updates
 * @param {Set<WebSocket>} clients - Set of connected clients
 */
const startStreaming = (clients: Set<WebSocket>): void => {
  setInterval(async () => {
    try {
      const latestLedger = await stellarService.getLatestLedger();
      broadcast(clients, JSON.stringify({ type: 'ledger', data: latestLedger }));
    } catch (error) {
      logger.error('Error streaming ledger updates:', error);
    }
  }, 5000); // Stream updates every 5 seconds
};

/**
 * Broadcast message to all connected clients
 * @param {Set<WebSocket>} clients - Set of connected clients
 * @param {string} message - Message to broadcast
 */
const broadcast = (clients: Set<WebSocket>, message: string): void => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

export default {
  initializeWebSocketServer,
  handleConnection,
  handleMessage,
  handleDisconnection,
  sendLatestLedger,
  startStreaming,
  broadcast
};
