# Step 1: Build Frontend
FROM node:20 AS frontend-build

WORKDIR /app

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

RUN python manage.py makemigrations  # Make migrations for the app
RUN python manage.py migrate         # Apply migrations to the database

# Step 3: Copy the built frontend files (build) into the backend static directory
COPY --from=frontend-build /app/build /app/static/

# Collect static files to ensure proper Django static file management
RUN python manage.py collectstatic --noinput

# Expose port for the application
EXPOSE 8000

# Step 4: Use gunicorn for production (instead of Django's dev server)
CMD ["gunicorn", "ieltsgo.wsgi:application", "--bind", "0.0.0.0:8000"]
