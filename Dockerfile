# Step 1: Build Frontend
FROM node:20 AS frontend-build

WORKDIR /frontend

# Install frontend dependencies
COPY frontend/package*.json ./ 
RUN npm install

# Copy all frontend files and run the build
COPY frontend ./ 
RUN npm run build

# Step 2: Backend with Django
FROM python:3.11 AS backend

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./ 
RUN pip install -r requirements.txt

# Copy all backend files
COPY backend ./ 

# Step 3: Copy the built frontend files (dist) into the backend static directory
COPY --from=frontend-build /frontend/dist /app/backend/static/

# Collect static files to ensure proper Django static file management
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Start the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
