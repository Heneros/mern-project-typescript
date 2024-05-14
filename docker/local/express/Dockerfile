FROM  node:20.10.0

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "server"]
