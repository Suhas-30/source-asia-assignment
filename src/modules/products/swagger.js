module.exports = {
  '/products': {
    post: {
      summary: 'Create a product',
      tags: ['Products'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'sku'],
              properties: {
                name: { type: 'string', example: 'Widget A' },
                sku: { type: 'string', example: 'SKU-001' },
                image_urls: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://cdn.example.com/products/sku-001/img-1.jpg'],
                },
                video_urls: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://cdn.example.com/products/sku-001/demo.mp4'],
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Product created successfully' },
        400: { description: 'Bad request' },
        409: { description: 'SKU already exists' },
      },
    },
    get: {
      summary: 'List all products',
      tags: ['Products'],
      parameters: [
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
      ],
      responses: {
        200: { description: 'Products retrieved successfully' },
      },
    },
  },
  '/products/{id}': {
    get: {
      summary: 'Get product by ID',
      tags: ['Products'],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Product retrieved successfully' },
        404: { description: 'Product not found' },
      },
    },
  },
  '/products/{id}/media': {
    post: {
      summary: 'Add media to product',
      tags: ['Products'],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                image_urls: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://cdn.example.com/products/sku-001/img-2.jpg'],
                },
                video_urls: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://cdn.example.com/products/sku-001/demo2.mp4'],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Media added successfully' },
        400: { description: 'Bad request' },
        404: { description: 'Product not found' },
      },
    },
  },
};