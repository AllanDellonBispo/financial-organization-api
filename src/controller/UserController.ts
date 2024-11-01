import { User } from "../entity/User";
import {Request, Response} from 'express';
import express from "express";
import JWT from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

export const all = async (req: Request, res: Response) => {
    await User.find().then((data)=>{
        res.json(data);
    })
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password){
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: {email, password}
        });

        if(user){
            const token = JWT.sign(
                {id:user.id, email: user.email},
                process.env.JWT_SECRET_KEY as string,
                {expiresIn: '2h'}
            );
            
            res.json({status: true, token});
            return;
        }

    }
    res.json({status: false});

}

export default router;