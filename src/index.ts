import { Server } from 'http';
import WebSocket from 'ws';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';
import { websocketService } from './services';
import { ledgerPoller } from './services/ledgerPoller.service';

let server: Server;
let wss: WebSocket.Server;
const clients = new Set<WebSocket>();

prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);

    // Start the ledger poller
    ledgerPoller.start();

    // Initialize WebSocket server
    wss = websocketService.initializeWebSocketServer(server);

    wss.on('connection', (ws: WebSocket) => {
      websocketService.handleConnection(ws, clients);
    });

    websocketService.startStreaming(clients);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
