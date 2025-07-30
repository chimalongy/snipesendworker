# Docker Setup for Worker Application

This document provides instructions for running the worker application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the application with Redis:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t worker-app .
   ```

2. **Run Redis container:**
   ```bash
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

3. **Run the worker application:**
   ```bash
   docker run -d --name worker-app \
     -p 4000:4000 \
     -e REDIS_URL=redis://host.docker.internal:6379 \
     --link redis \
     worker-app
   ```

## Environment Variables

The application uses the following environment variables:

- `PORT`: Port for the Express server (default: 4000)
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)
- `NODE_ENV`: Environment mode (production/development)

## API Endpoints

Once running, the application exposes:

- **Health Check**: `GET http://localhost:4000/schedule`
- **Schedule Task**: `POST http://localhost:4000/schedule`

### Example API Usage

```bash
curl -X POST http://localhost:4000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "triggerAt": "2024-01-01T12:00:00Z",
    "recipients": ["user@example.com"],
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "your-email@gmail.com",
        "pass": "your-password"
      }
    },
    "interval": 60,
    "outboundname": "Test Campaign",
    "outboundId": "123",
    "taskSubject": "Test Email",
    "taskBody": "This is a test email",
    "taskname": "Test Task",
    "sendername": "Test Sender",
    "signature": "Best regards"
  }'
```

## Docker Compose Services

### Redis Service
- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Volume**: Persistent Redis data
- **Health Check**: Redis ping

### Worker Service
- **Image**: Built from local Dockerfile
- **Port**: 4000
- **Dependencies**: Redis (waits for Redis to be healthy)
- **Health Check**: HTTP endpoint check

## Troubleshooting

### Check container logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs worker
docker-compose logs redis
```

### Check container status:
```bash
docker-compose ps
```

### Access container shell:
```bash
docker-compose exec worker sh
docker-compose exec redis redis-cli
```

### Clean up:
```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Production Considerations

1. **Environment Variables**: Set proper environment variables for production
2. **Redis Security**: Configure Redis with authentication in production
3. **Network Security**: Use proper network isolation
4. **Logging**: Configure proper logging for production
5. **Monitoring**: Set up monitoring for the containers

## Development

For development, you can override the Dockerfile:

```bash
# Use development dependencies
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Create a `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  worker:
    build:
      context: .
      dockerfile: Dockerfile.dev
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
``` 