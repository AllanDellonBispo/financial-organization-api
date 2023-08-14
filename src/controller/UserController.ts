import { User } from "../entity/User";
import {Request, Response} from 'express';
import express from "express";

const router = express.Router();

export const all = async (req: Request, res: Response) => {
    await User.find().then((data)=>{
        res.json(data);
    })
}

export const create = async (req: Request, res: Response) => {
    try{
        const user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        await user.save();
        res.status(201).json({user});
    }catch(error){
        res.status(400).json({error});
    }
}

export default router;