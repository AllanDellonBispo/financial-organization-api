import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Extract } from "./entity/Extract"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "financial-organization",
    synchronize: true,
    logging: false,
    entities: [User, Extract],
    migrations: [],
    subscribers: [],
})
