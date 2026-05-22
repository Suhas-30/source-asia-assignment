module.exports = {
  "/request": {
    post: {
      summary: "Submit a request",
      tags: ["Rate Limiter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["user_id", "payload"],
              properties: {
                user_id: {
                  type: "string",
                  example: "9fe85b7b-5b79-4cde-9e2e-fa1f18ca23df",
                },
                payload: { type: "object", example: { message: "hello" } },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Request accepted",
        },
        429: {
          description: "Too many requests",
        },
        400: {
          description: "Bad request",
        },
      },
    },
  },
  "/stats": {
    get: {
      summary: "Get stats per user",
      tags: ["Rate Limiter"],
      responses: {
        200: {
          description: "Stats retrieved successfully",
        },
      },
    },
  },
};
