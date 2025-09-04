# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & lockfile
COPY package*.json ./

# Install only production deps
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose app port (from .env)
EXPOSE 4000

# Run app
CMD ["npm", "start"]
