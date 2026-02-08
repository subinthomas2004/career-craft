# Use Node.js LTS as base
FROM node:18-slim

# Install system dependencies (Compilers & Runtimes)
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    gcc \
    default-jdk \
    sqlite3 \
    mono-complete \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create temp directory for code execution
RUN mkdir -p temp

# Expose port
EXPOSE 5001

# Start server
CMD ["node", "server.js"]
