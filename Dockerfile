FROM node:20 AS frontend-build

WORKDIR /app

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend files and run the build
COPY frontend ./
RUN npm run build


FROM python:3.11 AS backend

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

# Copy all backend files
COPY backend ./
# Step 3: Copy the built frontend files (build) into the backend static directory
COPY --from=frontend-build /app/dist/assets /app/static/assets
COPY --from=frontend-build /app/dist/index.html /app/templates/index.html

# Collect static files to ensure proper Django static file management
RUN python manage.py makemigrations  # Make migrations for the app
RUN python manage.py migrate         # Apply migrations to the database
RUN python manage.py collectstatic --noinput
RUN python manage.py createsuperuser --noinput

EXPOSE 8000

# Start the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
