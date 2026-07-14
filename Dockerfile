# syntax=docker/dockerfile:1
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

USER node
CMD ["npm", "start"]
