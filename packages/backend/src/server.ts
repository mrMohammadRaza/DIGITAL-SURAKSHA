import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log('====================================================');
  console.log(`🛡️  DIGITAL SURAKSHA BACKEND SERVER RUNNING`);
  console.log(`🌐 Environment:  ${env.NODE_ENV}`);
  console.log(`📡 URL:          http://localhost:${env.PORT}`);
  console.log(`🩺 Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  console.log(`🚀 API Base:     http://localhost:${env.PORT}${env.API_PREFIX}`);
  console.log('====================================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
