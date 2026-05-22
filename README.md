# Source Asia Backend Assignment

A rate-limited API and product catalog built with Node.js and Express.

**Live URL:** https://source-asia-assignment.onrender.com/api/health  
**Swagger UI:** https://source-asia-assignment.onrender.com/api-docs

> Note: Hosted on Render free tier — first request may take ~30 seconds to wake up.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** JavaScript (CommonJS)
- **Storage:** In-memory (Map, Set)
- **Docs:** Swagger UI (OpenAPI 3.0)
- **Logging:** Winston
- **Containerization:** Docker

---

## Project Structure

```
src/
├── config/
│   ├── index.js           # App constants
│   └── swagger.js         # Swagger config
├── shared/
│   ├── logger.js          # Winston logger
│   ├── response.js        # Reusable success/error responses
│   └── errors.js          # Custom error classes
├── modules/
│   ├── user/
│   │   ├── routes.js      # Generate user ID
│   │   └── swagger.js
│   ├── rateLimiter/
│   │   ├── IRateLimiterStore.js
│   │   ├── InMemoryRateLimiterStore.js
│   │   ├── RateLimiterService.js
│   │   ├── strategies/
│   │   │   ├── IRateLimiterStrategy.js
│   │   │   └── FixedWindowStrategy.js
│   │   ├── controller.js
│   │   ├── validator.js
│   │   ├── routes.js
│   │   └── swagger.js
│   └── products/
│       ├── IProductStore.js
│       ├── InMemoryProductStore.js
│       ├── ProductService.js
│       ├── controller.js
│       ├── validator.js
│       ├── routes.js
│       └── swagger.js
├── app.js
└── server.js
```

---

## Design Patterns Used

- **Strategy Pattern** — Rate limiting algorithm is injected into the service. `FixedWindowStrategy` is the current implementation. `SlidingWindowStrategy` or `TokenBucketStrategy` can be added in future without changing service or controller.
- **SOLID Principles** — Each file has a single responsibility. Services depend on abstractions (interfaces) not concrete implementations.
- **Dependency Injection** — Store and strategy are injected into services via constructor.

---

## How to Run

### Option 1 — Node.js

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production
npm start
```

### Option 2 — Docker

```bash
# Build image
docker build -t ratelimiter-api .

# Run container
docker run -p 3000:3000 ratelimiter-api
```

### Option 3 — Docker Compose

```bash
docker-compose up
```

Server runs on `http://localhost:3000`

---

## API Endpoints

### Health Check
```
GET /api/health
```

### User
```
GET /api/users/generate     — Generate a unique user ID
```

### Part 1 — Rate Limiter
```
POST /api/request           — Submit a rate limited request
GET  /api/stats             — Get stats per user
```

### Part 2 — Products
```
POST /api/products          — Create a product
GET  /api/products          — List products (paginated)
GET  /api/products/:id      — Get product by ID (full detail with media)
POST /api/products/:id/media — Add media URLs to a product
```

---

## Part 1 — Rate Limiter

### Design Decisions

- **Window type:** Fixed 1-minute window. The window resets at `windowStart + 60000ms`. Simpler to implement than rolling window; trade-off is a user can make 5 requests at 00:59 and 5 more at 01:00 (10 requests in ~2 seconds). Documented as a known limitation.
- **Max requests:** 5 per user per window
- **Success response:** `201 Created` — the request was accepted and processed
- **Concurrency:** Node.js is single-threaded; check-and-increment is synchronous with no `await` between read and write, so no race conditions on a single instance
- **Rejected stats:** Cumulative — rejected count keeps incrementing across windows

### curl Examples

**Generate user ID:**
```bash
curl http://localhost:3000/api/users/generate
```

**Submit request (accepted):**
```bash
curl -X POST http://localhost:3000/api/request \
  -H "Content-Type: application/json" \
  -d '{"user_id": "your-user-id", "payload": {"message": "hello"}}'
```

**Submit 6th request (rejected):**
```bash
# Run the above command 6 times — 6th returns 429
```

**Get stats:**
```bash
curl http://localhost:3000/api/stats
```

### Stats Response Schema

```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "user-id-here": {
      "accepted": 5,
      "rejected": 1,
      "windowStart": 1716000000000
    }
  }
}
```

### Production Limitations

| Limitation | Details |
|---|---|
| Single instance only | In-memory store is not shared across multiple instances |
| Restart loses state | All counters reset on server restart |
| Fixed window edge case | Up to 10 requests possible in ~2 seconds across window boundary |
| No persistence | No Redis or database backing |

**What would change in production:**
- Replace `InMemoryRateLimiterStore` with `RedisRateLimiterStore` — no other files change (Strategy + DI pattern)
- Use Redis `INCR` with `EXPIRE` for atomic operations across multiple instances
- Switch to `SlidingWindowStrategy` for more accurate limiting

---

## Part 2 — Product Catalog

### Design Decisions

- **Duplicate SKU:** Returns `409 Conflict` — SKU is a unique business identifier, conflict is more accurate than bad request
- **URL validation:** Must be `http://` or `https://`, max 2048 characters (browser safe max)
- **Max URLs per request:** 20 per array (image_urls and video_urls)

### Data Model

Products and media are stored **separately** in memory:

```
_products Map  →  { id, name, sku, image_count, video_count, created_at }
_media Map     →  { productId → { image_urls[], video_urls[] } }
_skus Set      →  { sku, sku, ... }
```

**Why separate storage:**
- `GET /products` (list) only reads `_products` map — never touches `_media`
- `GET /products/:id` (detail) reads both and joins them
- With 1000 products × 10 images each, list query never loads 10,000 URLs

### List vs Detail Query Difference

| Endpoint | Data returned | Media loaded |
|---|---|---|
| GET /products | id, name, sku, image_count, video_count, created_at | No |
| GET /products/:id | All above + image_urls[], video_urls[] | Yes |

### Pagination

- Default limit: `10`
- Max limit: `100`
- Query params: `?limit=10&offset=0`

```bash
curl "http://localhost:3000/api/products?limit=10&offset=0"
```

### curl Examples

**Create product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Widget A",
    "sku": "SKU-001",
    "image_urls": ["https://cdn.example.com/products/sku-001/img-1.jpg"],
    "video_urls": ["https://cdn.example.com/products/sku-001/demo.mp4"]
  }'
```

**List products:**
```bash
curl "http://localhost:3000/api/products?limit=10&offset=0"
```

**Get product by ID:**
```bash
curl http://localhost:3000/api/products/your-product-id
```

**Add media:**
```bash
curl -X POST http://localhost:3000/api/products/your-product-id/media \
  -H "Content-Type: application/json" \
  -d '{
    "image_urls": ["https://cdn.example.com/products/sku-001/img-2.jpg"],
    "video_urls": ["https://cdn.example.com/products/sku-001/demo2.mp4"]
  }'
```

### What Would Change With PostgreSQL + CDN in Production

| Current | Production |
|---|---|
| In-memory Map | PostgreSQL with `products` and `media` tables |
| No CDN | Media URLs point to real CDN (S3, Cloudflare) |
| image_count computed on write | Computed via SQL `COUNT` or maintained as column |
| List query reads Map | `SELECT id, name, sku, image_count FROM products LIMIT ? OFFSET ?` |
| Detail query joins in JS | `JOIN` with media table or separate query |
| Restart loses data | Persistent storage |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment |
| LOG_LEVEL | info | Winston log level |
