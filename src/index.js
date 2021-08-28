// index.js
// This is the main entry point of our application

//Импортируем модули в начало файла
const depthLimit=require('graphql-depth-limit');
const{createComplexityLimitRule}=require('graphql-validation-complexity');

//сначала затребуем пакет в начале файла
const cors=require('cors');
//Сначала затребуем пакет в начале файла
const helmet=require('helmet')


const  express=require('express');
const {ApolloServer} =require('apollo-server-express');
require('dotenv').config();

//Local module imports
const db=require('./db');
const models=require('./models');
const typeDefs=require('./schema');
const resolvers=require('./resolvers');
const jwt=require('jsonwebtoken');

//Run our server in a port specified in our .env file or port 4000
const port =process.env.PORT || 4000;
const DB_HOST=process.env.DB_HOST;

const app=express();
//Добавляем промежуточное ПО в начало стека, после const app=express()
app.use(helmet());
//добавляем промежуточное ПО после app.use(helmet());
app.use(cors());

db.connect(DB_HOST);

//Apollo Server Setup
//Обновляем код ApolloServer, добавив validationRules
const server=new ApolloServer({
    typeDefs,
    resolvers,
    validationRules:[depthLimit(5), createComplexityLimitRule(1000)],
    context:async ({req})=>{
        //Получаем токен пользователя из заголовков
        const token=req.headers.authorization;
        //Пытаемся извлечь пользователя с помощью токена
        const user=await getUser(token);
        //Добавляем модели БД и пользователя в контекст
        return{models, user};
    }
});

//Applyy the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app, path:'/'});

app.listen({port},()=>
console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
)
);
//Получаем информацию пользователя из JWT
const getUser=token=>{
    if(token){
        try{
            //Возвращаем информацию пользователя из токена
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err){
            //Если с токеном возникла проблема, выбрасываем ошибку
            new Error('Session invalid');
        }
    }
};