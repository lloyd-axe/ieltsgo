# Use official Node image with npm included
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy the entire frontend source code
COPY . .

# Build the Vite app (output to the 'dist' directory by default)
RUN npm run build

# Serve with Nginx
FROM nginx:alpine AS production

# Copy built files to Nginx's HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
