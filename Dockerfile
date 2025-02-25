# ========================
# 1. Build React Frontend
# ========================
FROM node:20 AS frontend-build

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend files and build with Vite
COPY frontend .
RUN npm run build

# ========================
# 2. Build Django Backend
# ========================
FROM python:3.11 AS backend-build

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend files
COPY backend .

# Copy frontend build to Django static files
COPY --from=frontend-build /app/dist ./static

# Collect static files for Django
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
