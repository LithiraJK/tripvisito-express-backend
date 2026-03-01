# Docker Setup Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose v3.8 or higher

## Quick Start

### 1. Setup Environment Variables
Copy the example environment file and update with your credentials:
```bash
copy .env.example .env
```

Update the `.env` file with your MongoDB Atlas connection string and API keys.

### 2. Build and Run
```bash
docker-compose up -d
```

This will start the backend API on port 5000.

### 3. View Logs
```bash
docker-compose logs -f
```

### 4. Stop Services
```bash
docker-compose down
```

## Docker Commands

### Build the Docker Image
```bash
docker build -t tripvisito-backend .
```

### Run the Container
```bash
docker run -p 5000:5000 --env-file .env tripvisito-backend
```

### Using Docker Compose (Recommended)
```bash
# Start services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Remove everything including volumes
docker-compose down -v
```

## Accessing the Application

Once running, your backend will be available at:
- **API Base**: `http://localhost:5000/api/v1/...`
- **Health Check**: `http://localhost:5000/`
- **WebSocket**: `ws://localhost:5000/socket.io/`

## Environment Variables

Key environment variables (set in `.env`):
- `NODE_ENV`: Set to `production` for production builds
- `MONGODB_URI`: MongoDB Atlas connection string
- `PORT`: Application port (default: 5000)
- `CORS_ORIGIN`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens
- API keys: Stripe, Cloudinary, Gemini, Unsplash, etc.

## MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with password
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Get your connection string
5. Update `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Troubleshooting

### Container won't start
Check logs:
```bash
docker-compose logs
```

### Can't connect to MongoDB Atlas
1. Check your `MONGODB_URI` in `.env` file
2. Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
3. Verify database credentials are correct
4. Check MongoDB Atlas cluster is running

### Port conflicts
If port 5000 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:5000"
```

### Build fails
```bash
# Clean build
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

### Build for production:
```bash
docker-compose up -d --build
```

### Security Checklist:
- ✅ Use strong MongoDB credentials
- ✅ Set secure JWT secrets
- ✅ Whitelist only necessary IPs in MongoDB Atlas
- ✅ Use environment-specific `.env` files
- ✅ Never commit `.env` to version control
- ✅ Enable MongoDB Atlas backup
- ✅ Set proper CORS_ORIGIN (not `*`)
- ✅ Use HTTPS in production

## Project Structure

```
tripvisito-express-backend/
├── src/                   # Source code
├── dist/                  # Compiled JavaScript (in container)
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Docker Compose configuration
├── .dockerignore         # Files to exclude from build
├── .env.example          # Environment variables template
├── .env                  # Your environment variables (not in git)
└── DOCKER.md             # This file
```

## Dockerfile Details

The Dockerfile uses a **multi-stage build**:
1. **Builder stage**: Installs all dependencies and builds TypeScript
2. **Production stage**: Only includes production dependencies and compiled code

This results in a smaller, more secure image.

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify your `.env` file is correctly configured
3. Ensure Docker Desktop is running
4. Check MongoDB Atlas connection and IP whitelist
