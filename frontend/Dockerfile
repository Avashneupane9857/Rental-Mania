# Stage 1: Build
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the application using Vite
RUN npm run build

# Verify the build output (Vite outputs to /app/dist by default)
RUN ls -l /app/dist

# Stage 2: Production
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static assets
RUN rm -rf ./*

# Copy built React app from the build stage
COPY --from=build /app/dist .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
