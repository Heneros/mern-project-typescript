FROM node:16-alpine3.12

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g webpack webpack-cli webpack-dev-server

RUN npm install --save babel-loader @babel/core @babel/preset-env @babel/preset-react

COPY . /app

CMD ["npm", "run", "start"]