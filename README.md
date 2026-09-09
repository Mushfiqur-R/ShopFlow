# ShopFlow Modular Monolith Foundation

Initial foundation for **ShopFlow** built with NestJS, TypeScript, PostgreSQL, Prisma 6, and Swagger.

This foundation provides a clean modular architecture and basic CRUD REST endpoints without business/transaction logic, allowing you to implement transactions, rollbacks, and advanced flows yourself in subsequent steps.

---

## Current Module Structure

```text
src/
├── users/          # Users management module (POST, GET, GET :id)
├── products/       # Products catalog module (POST, GET, GET :id, PATCH :id)
├── inventory/      # Inventory management module (POST, GET :productId, PATCH :productId)
├── orders/         # Orders module (GET, GET :id, POST placeholder)
├── payments/       # Payments module (GET :orderId)
├── notifications/  # Internal notifications module foundation
├── prisma/         # PrismaService and global PrismaModule
└── app.module.ts   # Root application module
```

---

## 1. Project Setup

Install the required npm dependencies:

```bash
npm install @nestjs/swagger class-validator class-transformer
```

---

## 2. Database Setup

Start PostgreSQL via Docker Compose:

```bash
docker compose up -d
```

---

## 3. Prisma Migration & Client Generation

Run the Prisma migration to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma Client:

```bash
npx prisma generate
```

---

## 4. Database Seed

Populate the database with initial seed data (2 Users, 5 Products, and initial Inventory for each product):

```bash
npx prisma db seed
```

---

## 5. Running the Application

Development mode:

```bash
npm run start:dev
```

Production build & start:

```bash
npm run build
npm run start:prod
```

Swagger API documentation will be available at:

```text
http://localhost:3000/api
```

---

## 6. Available APIs

### Users (`/users`)
- `POST /users` - Create a user
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID

### Products (`/products`)
- `POST /products` - Create a product
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `PATCH /products/:id` - Update product by ID

### Inventory (`/inventory`)
- `POST /inventory` - Create inventory record
- `GET /inventory/:productId` - Get inventory by product ID
- `PATCH /inventory/:productId` - Update inventory by product ID

### Orders (`/orders`)
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Placeholder endpoint (ready for transaction implementation)

### Payments (`/payments`)
- `GET /payments/:orderId` - Get payment details by order ID

### Swagger Documentation
- `GET /api` - Swagger UI interactive documentation
