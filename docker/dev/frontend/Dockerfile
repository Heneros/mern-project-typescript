FROM node:22.15-alpine


WORKDIR /app

COPY frontend/package*.json ./

RUN npm install 

COPY . .

CMD ["npm", "run", "webpack"]
