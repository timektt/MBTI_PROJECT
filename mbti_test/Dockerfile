# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json + lock ก่อน เพื่อ cache layer
COPY package*.json ./

# Install deps แบบ production เท่านั้น
RUN npm ci --omit=dev

# Copy source code ภายหลัง
COPY . .

# Prisma generate (จำเป็นสำหรับ next-auth/prisma-adapter)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Open port 3000
EXPOSE 3000

# Run production server
CMD ["npm", "start"]
