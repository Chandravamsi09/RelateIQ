# RelateIQ Enterprise Deployment Guide

## Docker Compose Deployment
```yaml
version: '3.8'

services:
  relateiq-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://relateiq:secret@postgres:5432/relateiq_prod
      - JWT_SECRET=production-secret-key-2026
    depends_on:
      - postgres
      - redis

  relateiq-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - relateiq-backend

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=relateiq
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=relateiq_prod
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```
