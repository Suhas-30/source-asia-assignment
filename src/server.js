const app = require('./app');
const config = require('./config');
const logger = require('./shared/logger')

const server = app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`Health check: http://localhost:${config.PORT}${config.API_PREFIX}/health`);
});


process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', err);
  server.close(() => process.exit(1));
});


process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
  server.close(() => process.exit(1));
});


module.exports = server;