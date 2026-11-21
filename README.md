# Crystal Beauty Cosmetics – Backend API

REST API for the **Crystal Beauty Cosmetics (CBC)** online store. It handles users and authentication, products, orders and customer reviews.

Frontend repository: [Crystal-Beauty-Frontend](https://github.com/Bineth-Tharana/Crystal-Beauty-Frontend)
Live site: https://crystal-beauty-frontend-pink.vercel.app/

## Features

- **Authentication:** register, log in with email and password, or log in with Google. Sessions use JWT tokens.
- **Roles:** `customer` and `admin`. Admin-only routes are protected on the server.
- **Password reset:** one-time password (OTP) sent by email.
- **Products:** list, search, view, add, edit and delete. Customers only see available products, admins see all.
- **Orders:** customers place orders and see their own, admins see all orders and update their status.
- **Reviews:** customers rate and review products, admins can hide or delete reviews.
- **User management:** admins can list users and block or unblock accounts. Blocked users cannot log in.

## Tech stack

- Node.js (ES modules) and Express 5
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`) and `bcrypt` for password hashing
- Nodemailer (Gmail) for OTP emails
- Axios for the Google user info request

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Gmail account with an [app password](https://support.google.com/accounts/answer/185833) (only needed for password reset emails)

### Installation

```bash
git clone https://github.com/Bineth-Tharana/Crystal-Beauty-Backend.git
cd Crystal-Beauty-Backend
npm install
```

### Environment variables

Create a `.env` file in the project root (it is already in `.gitignore`, never commit it):

```env
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_KEY=use-a-long-random-secret-string
GOOGLE_APP_PASSWORD=your-gmail-app-password
```

| Variable | Description |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_KEY` | Secret used to sign and verify login tokens |
| `GOOGLE_APP_PASSWORD` | Gmail app password used to send OTP emails |

### Run the server

```bash
npm start
```

The API runs on **http://localhost:3000** and `npm start` uses nodemon, so it restarts when you edit a file.

## Authentication

Send the token you receive from the login endpoints in the `Authorization` header:

```
Authorization: Bearer <token>
```

Routes marked **Login** need any logged-in user, and routes marked **Admin** need a user with the `admin` role.

## API reference

Base URL: `http://localhost:3000/api`

### Users `/api/users`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | Public | Register a user (creating an `admin` needs an admin token) |
| POST | `/login` | Public | Log in with email and password, returns a token |
| POST | `/login/google` | Public | Log in with a Google access token |
| POST | `/send-otp` | Public | Email a password reset OTP |
| POST | `/reset-password` | Public | Reset a password with email, OTP and new password |
| GET | `/` | Login | Details of the logged-in user |
| GET | `/all` | Admin | List all users (without passwords) |
| PUT | `/block/:email` | Admin | Block or unblock a user, body: `{ "isBlocked": true }` |

### Products `/api/products`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | List products (admins also see unavailable ones) |
| GET | `/search/:query` | Public | Search products |
| GET | `/:productId` | Public | Get one product |
| POST | `/` | Admin | Add a product |
| PUT | `/:productId` | Admin | Update a product |
| DELETE | `/:productId` | Admin | Delete a product |

### Orders `/api/orders`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | Login | Place an order |
| GET | `/` | Login | Customers get their own orders, admins get all orders |
| PUT | `/:orderId/:status` | Admin | Update an order status (`pending`, `completed`, `cancelled`, `returned`) |

Example order request body:

```json
{
  "name": "Customer Name",
  "address": "123 Main Street, Colombo",
  "phone": "0771234567",
  "products": [
    { "productId": "CBC-001", "qty": 2 }
  ]
}
```

Prices and totals are calculated on the server from the product data.

### Reviews `/api/reviews`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | Login | Add a review, body: `{ "productId", "rating" (1-5), "comment" }`. One review per customer per product |
| GET | `/product/:productId` | Public | Visible reviews for a product |
| GET | `/` | Admin | All reviews |
| PUT | `/:id/visibility` | Admin | Hide or show a review, body: `{ "isApproved": false }` |
| DELETE | `/:id` | Admin | Delete a review |

## Project structure

```
├── index.js              # App setup, middleware, routes, database connection
├── controllers/          # Request handling and business logic
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   └── reviewController.js
├── models/               # Mongoose schemas
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── review.js
│   └── otp.js
└── routes/               # Route definitions
    ├── userRoute.js
    ├── productRoute.js
    ├── orderRoute.js
    └── reviewRoute.js
```

## Creating the first admin

New accounts are customers by default, and only an admin can create another admin through the API. For the very first admin, register a normal account, then open your database (for example in MongoDB Atlas or Compass) and change that user's `role` field from `customer` to `admin`.

## Author

Bineth Tharana
