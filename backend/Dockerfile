# Use Node 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies required for building native modules and networking
RUN apk add --no-cache python3 make g++ bash curl

# Copy package.json for installing dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Copy wait-for-it.sh script and make it executable
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Start backend only after MySQL is ready
CMD ["sh", "-c", "./wait-for-it.sh mysql:3306 -- node src/server.js"]
