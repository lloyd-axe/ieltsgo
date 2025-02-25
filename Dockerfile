# Step 1: Build Frontend with Vite
FROM node:20 AS frontend-build

WORKDIR /frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend files and build
COPY frontend/ .
RUN npm run build

# Step 2: Setup Django Backend
FROM python:3.11

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy built frontend files to Django static folder
COPY --from=frontend-build /frontend/dist /app/static

# Collect static files (for Django admin and others)
RUN python manage.py collectstatic --noinput

# Expose the port Django will run on
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
