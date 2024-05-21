import path from 'path';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/auth.js';

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.use('/api/v1/auth', authRoutes);

console.log('hello world123');

const port = process.env.PORT || 4000;
// local
const MONGO_URITest = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/mernvilla`;
const MONGO_URI = process.env.MONGO_URI;

// PORT=1997

// MONGO_ROOT_USERNAME=3bb8894935d74893907b0e552f50cb9597c6f410fab9b099b69ce3acea89
// MONGO_ROOT_PASSWORD=ce0f697c7ab3a331a185

// MONGO_URI=mongodb+srv://punk60826:5RDsLg75YdWpnV6X@cluster0.7jjv1y5.mongodb.net/mernVilla?retryWrites=true&w=majority

// DOMAIN=http://localhost:8080

// JWT_ACCESS_SECRET_KEY=4f5b4a0c2db99e7f304ab1238f28234759836a359d5708d10c8095fd9030
// JWT_REFRESH_SECRET_KEY=bd1ba2c8956bbc89322d639b0a123173c7ef9e14c1e9acc29c2666cdfc57

-------------------
Code брать.
mern invoice
react project ulbi typescript
-------------------
Technology:
.eslint связать и настроить
docker compose 
typescript 
passport register google 
сontact us
cloudflare изображения все
jest тест блоков
webpack react project ulbi typescript для react запускалось приложение
  Feature-Sliced Design (FSD).
-------------------
Pages:
register
login
homepage
verification page
user profile 
contact us
shop
reset password
users list - admin page
products list - admin page
edit product - admin page
single product add  Schedule a visit
user profile можно download pdf 
-------------------
Дата сдача
28 мая
-------------------
today
concurrently добавить 
mongodb ссылку



-------------------
tomorrow
sendEmail сделать  при register
создать пользователя
логин пользователя 
Logger

-------------------
remember
npm cache clean --force
npm init @eslint/config
rm -rf node_modules



Проксирование - это механизм, который позволяет передавать запросы от клиента к одному серверу (называемому прокси-сервером), который затем передает запросы другому серверу, выполняет необходимую обработку и возвращает результат клиенту.



Заголовок Host - это часть HTTP-запроса, в которой клиент указывает имя хоста, к которому он хочет обратиться. Это необходимо, поскольку серверы могут хостить несколько сайтов на одном IP-адресе, и заголовок Host позволяет серверу определить, какой сайт он должен обслужить.


  location / {
    proxy_pass http://client;

    proxy_redirect off;

    proxy_set_header Host $host;


Эта строка добавляет заголовок X-Real-IP в исходящий запрос. В него записывается значение $remote_addr, которое представляет собой IP-адрес клиента, сделавшего запрос. Это может быть полезно для сервера http://client для идентификации реального клиента, особенно если трафик проходит через несколько прокси-серверов.
    proxy_set_header X-Real-IP $remote_addr;

Эта строка добавляет заголовок X-Forwarded-For в исходящий запрос. В него записывается значение $proxy_add_x_forwarded_for, которое накапливает информацию обо всех IP-адресах прокси-серверов, через которые прошел запрос. Это может быть полезно для отслеживания пути запроса
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_set_header X-Forwarded-Host $server_name;

  }

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`${error}error`);
    }
};
start();
