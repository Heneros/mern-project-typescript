FROM node:22.15-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

CMD ["npm", "run", "server"]