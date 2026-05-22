const { BadRequestError } = require('../../shared/errors');

const validateRequest = (body) => {
  const { user_id, payload } = body;

  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    throw new BadRequestError('user_id is required and must be a non-empty string');
  }

  if (payload === undefined || payload === null) {
    throw new BadRequestError('payload is required');
  }
};

module.exports = { validateRequest };