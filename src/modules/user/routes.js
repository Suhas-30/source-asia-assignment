const express = require('express')
const {v4: uuidv4} = require('uuid')
const logger = require('../../shared/logger');
const { sendSuccess } = require('../../shared/response');

const router = express.Router();

router.get('/generate', (req, res)=>{
    const userId = uuidv4();
    logger.info(`Generated user_id: ${userId}`);
    sendSuccess(res, 200, 'User Id generated succesfully', {user_id: userId})
});

module.exports = router;