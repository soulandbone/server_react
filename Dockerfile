# Use Node.js base image
FROM node:18

# Install dependencies needed for sqlite3
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Create app directory in container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (change as needed)
EXPOSE 5000

# Start command
CMD ["npm", "start"]
