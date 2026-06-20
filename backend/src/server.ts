import http from 'http';
import { WebSocketServer } from 'ws';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import { priceEngine } from './services/priceEngine';

const app = createApp();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws/prices' });

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'prices', payload: priceEngine.getSnapshot() }));
});

const onPriceUpdate = (snapshot: ReturnType<typeof priceEngine.getSnapshot>) => {
  const message = JSON.stringify({ type: 'prices', payload: snapshot });
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(message);
  }
};

priceEngine.on('update', onPriceUpdate);
priceEngine.start();

server.listen(env.PORT, () => {
  logger.info(`Veridion backend listening on port ${env.PORT}`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully`);
  priceEngine.stop();
  priceEngine.off('update', onPriceUpdate);
  wss.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
