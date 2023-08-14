import { AppDataSource } from "./data-source"
import user from './routes/User/userRoutes';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import extract from './routes/Extract/extractRoutes';

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    //Mensagem de sucesso para indicar que o servidor está funcionando
    console.log("Server ready port 4000...");

    //instância do express para realizar as configurações a baixo
    const server = express();

    //configuração de cors
    server.use(cors());


    dotenv.config();

    //Difinindo tipo de comunicação usada 'JSON'
    server.use(express.json());

    //Habilita o uso do 'x-www-form-urlencoded' presente no postman
    server.use(express.urlencoded({ extended: true }));

    //Define a rota inicial do Sistema assim com a(s) instâncias de rotas a serem usadas
    server.use('/financial-organizational', [user, extract]);

    //Mostar em que porta o servidor estará funcioanado
    server.listen(process.env.PORT);
}).catch(error => console.log(error))