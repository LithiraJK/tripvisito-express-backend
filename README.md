# 🌍 Trip Visito - Express Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1-blue?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19-green?style=for-the-badge&logo=mongodb)
[![Live API](https://img.shields.io/badge/Live-API-success?style=for-the-badge)](https://tripvisito-express-backend-ow2e6cxc5.vercel.app)

**Production-ready RESTful API for Trip Visito Travel Management Platform**

[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Docker](#-docker-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Docker Deployment](#-docker-deployment)
- [Scripts](#-scripts)
- [Database Models](#-database-models)
- [Contributing](#-contributing)

---

## 🎯 Overview

The Trip Visito backend is a robust Express.js API built with TypeScript, providing comprehensive endpoints for user authentication, trip management, payment processing, real-time chat, and more. Designed for scalability and maintainability with clean architecture patterns.

### Key Features

- 🔐 **JWT Authentication** with role-based access control (User/Admin)
- 💳 **Stripe Integration** for secure payment processing
- 💬 **Socket.IO** for real-time chat and notifications
- 📧 **Email Service** with Nodemailer for transactional emails
- ☁️ **Cloudinary Integration** for image uploads
- 🔒 **Security** with CORS, helmet, and rate limiting
- 📊 **Analytics** endpoints for admin dashboard
- 🐳 **Docker Support** for containerized deployment

---

## ✨ Features

### Authentication & Authorization
- User registration with email verification
- JWT-based authentication
- Google OAuth integration
- Role-based access control (User, Admin)
- Password hashing with bcryptjs
- Refresh token mechanism

### Trip Management
- CRUD operations for trips
- Trip search and filtering
- Image upload with Cloudinary
- Trip categories and tags
- Pagination support

### Payment System
- Stripe checkout session creation
- Webhook handling for payment confirmation
- Payment history tracking
- Booking status management
- Refund processing

### Review System
- User reviews and ratings
- Only allow reviews from confirmed bookings
- Review moderation
- Average rating calculation

### Real-time Features
- Socket.IO for live communication
- Real-time chat between users and admin
- Live notifications for bookings
- Online status tracking

### Admin Features
- User management dashboard
- Trip analytics and statistics
- Payment tracking
- Review moderation
- Chat management

---

## 🛠 Tech Stack

### Core
- **Node.js** - Runtime environment
- **Express.js 5.1** - Web framework
- **TypeScript 5.9** - Type safety

### Database
- **MongoDB** - NoSQL database
- **Mongoose 8.19** - ODM for MongoDB

### Authentication & Security
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **cors** - CORS middleware

### Payment & Storage
- **Stripe 20.1** - Payment processing
- **Cloudinary** - Cloud storage for images
- **Multer** - File upload handling

### Communication
- **Socket.IO 4.8** - Real-time bidirectional communication
- **Nodemailer** - Email service

### Development
- **ts-node-dev** - Development server with auto-reload
- **Docker** - Containerization

---

## 📁 Project Structure

```
tripvisito-express-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts          # Cloudinary configuration
│   │   └── env.ts                 # Environment variables
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication logic
│   │   ├── chat.controller.ts     # Chat operations
│   │   ├── notification.controller.ts
│   │   ├── payment.controller.ts  # Stripe integration
│   │   ├── review.controller.ts   # Review management
│   │   ├── stats.controller.ts    # Analytics
│   │   └── trip.controller.ts     # Trip CRUD
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── role.middleware.ts     # Role checking
│   │   ├── upload.middleware.ts   # Multer config
│   │   └── webhook.middleware.ts  # Stripe webhooks
│   │
│   ├── models/
│   │   ├── chat.model.ts          # Chat schema
│   │   ├── notification.model.ts  # Notification schema
│   │   ├── payment.model.ts       # Payment schema
│   │   ├── review.model.ts        # Review schema
│   │   ├── trip.model.ts          # Trip schema
│   │   └── user.model.ts          # User schema
│   │
│   ├── routes/
│   │   ├── auth.routes.ts         # Auth endpoints
│   │   ├── chat.routes.ts         # Chat endpoints
│   │   ├── notification.routes.ts
│   │   ├── payment.routes.ts      # Payment endpoints
│   │   ├── review.routes.ts       # Review endpoints
│   │   ├── stats.routes.ts        # Analytics endpoints
│   │   └── trip.routes.ts         # Trip endpoints
│   │
│   ├── services/
│   │   ├── mail.service.ts        # Email service
│   │   └── socket.service.ts      # Socket.IO service
│   │
│   ├── utils/
│   │   ├── api.response.util.ts   # API response formatter
│   │   ├── email.template.ts      # Email templates
│   │   └── jwt.util.ts            # JWT utilities
│   │
│   └── index.ts                   # Application entry point
│
├── Dockerfile                      # Docker configuration
├── docker-compose.yml             # Docker Compose setup
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account or local MongoDB
- Stripe account
- Cloudinary account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LithiraJK/tripvisito-express-backend.git
   cd tripvisito-express-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials (see [Environment Variables](#-environment-variables))

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

The API will be available at `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tripvisito?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# CORS
CORS_ORIGIN=http://localhost:5173

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Account (Created on first run)
SUPER_ADMIN_EMAIL=admin@tripvisito.com
SUPER_ADMIN_PASSWORD=Admin@123
SUPER_ADMIN_NAME=Super Admin
```

### Getting API Keys

- **MongoDB Atlas:** [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Stripe:** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
- **Cloudinary:** [cloudinary.com/console](https://cloudinary.com/console)
- **Google OAuth:** [console.cloud.google.com](https://console.cloud.google.com)

---

## 📚 API Documentation

### Base URL
```
Production: https://tripvisito-express-backend-ow2e6cxc5.vercel.app/api/v1
Development: http://localhost:5000/api/v1
```

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

### Trips

#### Get All Trips
```http
GET /api/v1/trips?page=1&limit=10&search=bali&category=adventure
```

#### Get Trip by ID
```http
GET /api/v1/trips/:id
```

#### Create Trip (Admin)
```http
POST /api/v1/trips
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "title": "Bali Adventure Tour",
  "description": "Explore the beauty of Bali",
  "price": 1200,
  "duration": 7,
  "maxGroupSize": 15,
  "category": "adventure",
  "images": [<files>]
}
```

#### Update Trip (Admin)
```http
PUT /api/v1/trips/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 1100,
  "maxGroupSize": 20
}
```

#### Delete Trip (Admin)
```http
DELETE /api/v1/trips/:id
Authorization: Bearer <admin_token>
```

### Payments

#### Create Checkout Session
```http
POST /api/v1/payment/create-checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": "507f1f77bcf86cd799439011",
  "numberOfPeople": 2,
  "bookingDate": "2026-06-15"
}
```

#### Stripe Webhook
```http
POST /api/v1/payment/stripe-webhook
Content-Type: application/json
Stripe-Signature: <signature>
```

#### Get User Payments
```http
GET /api/v1/payment/user-payments
Authorization: Bearer <token>
```

### Reviews

#### Create Review
```http
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Amazing experience!"
}
```

#### Get Trip Reviews
```http
GET /api/v1/reviews/trip/:tripId
```

### Chat

#### Get Messages
```http
GET /api/v1/chat/messages/:userId
Authorization: Bearer <token>
```

#### Send Message (via Socket.IO)
```javascript
socket.emit('send_message', {
  receiverId: '507f1f77bcf86cd799439011',
  message: 'Hello!'
});
```

### Notifications

#### Get User Notifications
```http
GET /api/v1/notifications
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /api/v1/notifications/:id/read
Authorization: Bearer <token>
```

### Statistics (Admin)

#### Dashboard Stats
```http
GET /api/v1/stats/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalTrips": 45,
    "totalBookings": 3420,
    "totalRevenue": 125400,
    "recentBookings": [...],
    "popularTrips": [...]
  }
}
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Build and run**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Using Docker

```bash
# Build image
docker build -t tripvisito-backend .

# Run container
docker run -p 5000:5000 --env-file .env tripvisito-backend
```

For detailed Docker documentation, see [DOCKER.md](DOCKER.md)

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint (if configured) |

---

## 💾 Database Models

### User Model
```typescript
{
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Trip Model
```typescript
{
  title: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  category: string;
  images: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  included: string[];
  excluded: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
}
```

### Payment Model
```typescript
{
  userId: ObjectId;
  tripId: ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripeSessionId: string;
  numberOfPeople: number;
  bookingDate: Date;
  createdAt: Date;
}
```

---

## 🔗 Links

- **Live API:** [https://tripvisito-express-backend-ow2e6cxc5.vercel.app](https://tripvisito-express-backend-ow2e6cxc5.vercel.app)
- **Frontend Repository:** [tripvisito-react-frontend](https://github.com/LithiraJK/tripvisito-react-frontend)
- **Frontend Live:** [https://tripvisito.vercel.app](https://tripvisito.vercel.app)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Lithira Jayanaka**

- GitHub: [@LithiraJK](https://github.com/LithiraJK)
- Email: lithira.jayanaka.official@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ using Node.js & Express**

⭐ Star this repository if you find it helpful!

</div>