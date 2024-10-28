# Stage 1: Use Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the project files into the container
COPY . .

# Expose the port your app runs on (default 3000 for Express)
EXPOSE 3000

# Set the default command to start the app
CMD ["node", "index.js"]
