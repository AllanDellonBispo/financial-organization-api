import { Request, Response } from "express";
import { Extract } from "../entity/Extract";
import { Between } from "typeorm";

export const all = async (req: Request, res: Response) => {
    await Extract.find().then((data)=>{
        res.json(data);
    })
}

export const createExtract = async (req: Request, res: Response) => {
    try{
        const extract = new Extract();
        // extract.date = new Date();
        extract.date = req.body.date;
        extract.category = req.body.category;
        extract.title = req.body.title;
        extract.value = req.body.value;
        await Extract.save(extract);
        res.status(201).json({extract});
    }catch(error){
        res.status(400).json({error});
    }
}

export const searchPeriod = async (req: Request, res: Response) => {
    try{
        await Extract.find({
            where: {
                date: Between(req.body.dateInitial, req.body.dateFinal)
            }
        }).then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchInitial = async (req: Request, res: Response) => {
    try{
        const currentDate = new Date();
        await Extract.query(`select * from extract where month(date) = ${currentDate.getMonth()+1} order by date desc`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchNextMonth = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.body.month)+1}`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchPreviousMonth = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.body.month)-1}`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const expenses = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select sum(value) as total from extract where month(date) = ${parseInt(req.params.month)+1} and category = "Débito"`)
        .then((data)=>{
            res.json(data[0]);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const receipt = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select sum(value) as total from extract where month(date) = ${parseInt(req.params.month)+1} and category = "Crédito"`)
        .then((data)=>{
            res.json(data[0]);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

