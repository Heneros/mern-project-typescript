FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install react-scripts

COPY . .

ENV NODE_ENV=development

CMD ["npm", "start"]
