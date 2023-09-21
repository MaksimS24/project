//Библиотека с функциями позволяющая принимать данные для портов
const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const {createComplexityLimitRule} = require('graphql-validation-complexity');

//Поднимает(Общение) graphql
const {ApolloServer} = require('apollo-server-express');
require('dotenv').config();

//Импортируем локальные модули
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const {ApolloServerErrorCode} = require("@apollo/server/errors");

//Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;
//Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST;

const app = express();

//Подключаем к БД
db.connect(DB_HOST);

//Промежуточное ПО
app.use(helmet());
app.use(cors());

//Получаем информацию пользователя из JWT
const getUser = token => {
    if (token) {
        try {
            //Возвращаем информацию пользователя из токена
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            //Если с токеном возникла проблема, выбрасываем ошибку
            throw new Error('Session invalid');
        }
    }
}

//Настраиваем ApolloServer
let server = null;

async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
        context: async ({ req }) => {
            //Получаем токен пользователя из заголовков
            const token = req.headers.authorization;
            //Пытаемся извлечь пользователя с помощью токена
            const user = getUser(token);
            //Пока что выводить информацию о пользователе в консоль
            console.log(user);
            //Добавляем модели БД и пользователя в контекст
            return { models, user };
        },
    });

    await server.start();
    server.applyMiddleware({app, path: '/api'}
);

}

//Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
startServer().then(() => app.listen({port}, () =>
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    ))

);

