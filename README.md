# 🌍 Tripvisito - AI-Powered Travel Management System

**Tripvisito** is a production-level MERN stack application designed to simplify travel planning Users can explore curated itineraries, manage bookings, and interact with a modern glassmorphism-style review system

---

## 🚀 Live Deployments
* **Frontend Application:** [https://tripvisito.vercel.app](https://tripvisito.vercel.app)
* **Backend API URL:** [https://tripvisito-express-backend-ow2e6cxc5.vercel.app](https://tripvisito-express-backend-ow2e6cxc5.vercel.app)

---

## 💻 Source Code (GitHub)
* **Frontend Repository:** [https://github.com/LithiraJK/tripvisito-react-frontend.git](https://github.com/LithiraJK/tripvisito-react-frontend.git)
* **Backend Repository:** [https://github.com/LithiraJK/tripvisito-express-backend.git](https://github.com/LithiraJK/tripvisito-express-backend.git)

---

## 🛠 Technologies & Tools
* **Frontend:** React.js (Vite), TypeScript, Tailwind CSS, Framer Motion 
* **Backend:** Node.js, Express.js, JWT Authentication
* **Database:** MongoDB Atlas with Mongoose
* **Payments:** Stripe API 
* **Deployment:** Vercel (Frontend & Serverless Functions)

---

## ✨ Main Features

* **Modern Glassmorphism UI:** Features a blurred floating notification panel and an interactive review slider for a premium user experience.
* **Dynamic Itineraries:** Detailed travel plans with daily activities and location tracking .
* **Booking Management:** Users can track "Confirmed" and "Pending" trips in a sleek dashboard table.
* **Integrated Review System:** Secure backend logic that only allows confirmed travelers to rate and review their trips.
* **Admin Controls:** Comprehensive dashboard for user management and trip data updates.

---

## 📸 Project Preview

### 1. User Authentication
#### Login Page
![Login Page](src\assets\images\login.png)

#### Signup Page
![Signup Page](src\assets\images\signup.png)

### 2. Admin Dashboard
![Admin Dashboard](src\assets\images\admin-dash.png)

### 3. Stripe Payment
![Payment](./assets/images/review-slider.png)

### 4. User Dashboard Table
![User Dashboard](./assets/images/user-dashboard.png)

### 4. User Chat box
![User Chat box](./assets/images/user-dashboard.png)

---

## ⚙️ Setup and Run Instructions for Developers

### Option 1: Docker (Recommended)
```bash
# 1. Copy and configure environment
copy .env.example .env
# Edit .env with your MongoDB Atlas URI and API keys

# 2. Build and run with Docker
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

Backend will be available at `http://localhost:5000`

📖 **[See detailed Docker guide](DOCKER.md)**

### Option 2: Local Development
1. `npm install`
2. Create a `.env` file with `MONGODB_URI`, `JWT_SECRET`, and other required keys.
3. `npm run dev` (development) or `npm start` (production)

### Frontend Setup
1. `cd ../tripvisito-frontend` (if you have the frontend repo)
2. `npm install`
3. Create a `.env` file with `VITE_API_BASE_URL=http://localhost:5000`
4. `npm run dev`

---

## ✍️ Author
**Lithira Jayanaka**