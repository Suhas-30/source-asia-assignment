module.exports = {
  '/users/generate': {
    get: {
      summary: 'Generate a unique user ID',
      tags: ['Users'],
      responses: {
        200: {
          description: 'User ID generated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      user_id: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};