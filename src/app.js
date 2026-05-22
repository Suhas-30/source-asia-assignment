const express = require('express');
const logger = require('./shared/logger')
const {sendError} = require('./shared/response')
const {AppError} = require('./shared/errors');
const config = require('./config');
const userRoutes = require('./modules/user/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const rateLimiterRoutes = require('./modules/rateLimiter/routes')
const productRoutes = require('./modules/products/routes')
const app = express()


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next)=>{
    logger.info(`${req.method} ${req.url}`);
    next();
})

const router = express.Router();
router.use('/', rateLimiterRoutes)
router.get('/health', (req, res)=>{
    res.status(200).json({
        success: true,
        message: 'Server is running',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});


router.use('/users', userRoutes);
router.use('/products', productRoutes);

app.use(config.API_PREFIX, router)

app.use((req, res)=>{
    sendError(res, 404, `Route ${req.method} ${req.url} not found`);
})



app.use((err, req, res, next)=>{
    if(err instanceof AppError){
        logger.warn(`Operational error: ${err.message}`);
        return sendError(res, err.statusCode, err.message);
    }

    logger.error('Unexpected error', err);
  return sendError(res, 500, 'Internal Server Error');
})

module.exports = app;
