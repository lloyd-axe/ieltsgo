# Step 1: Build Frontend
FROM node:20 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Step 2: Backend with Django
FROM python:3.11 AS backend

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend ./
COPY --from=frontend-build /frontend/dist /app/static

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
