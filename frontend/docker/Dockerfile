FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install -g webpack webpack-cli ts-node typescript

RUN npm install

COPY . /app

CMD ["npm", "start"]