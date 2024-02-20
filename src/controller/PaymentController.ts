import { Request, Response } from "express";
import { Payment } from "../entity/Payment";


export const all = async (req: Request, res: Response) => {
    await Payment.find().then((data)=>{
        res.json(data);
    })
}

export const create = async (req: Request, res: Response) => {
    try{
        const payment = new Payment();
        payment.name = req.body.name;
        payment.description = req.body.description;
        payment.category = req.body.category;
        payment.value = req.body.value;
        payment.status = req.body.status;

        await Payment.save(payment);
        res.status(201).json({payment});
    }catch(error){
        res.status(400).json({error});
    }
}

export const update = async (req: Request, res: Response) => {
    try{
        const payment = await Payment.findOneBy({id:req.body.id});
        await Payment
        .createQueryBuilder()
        .update(payment)
        .set({
            name: req.body.name ? req.body.name : payment.name,
            description : req.body.description ? req.body.description : payment.description,
            category : req.body.category ? req.body.category : payment.category,
            value : req.body.value ? req.body.value : payment.value,
            status: req.body.status ? req.body.status : payment.status
        })
        .where(`id = :id`, {id: req.body.id})
        .execute();

        const payment2 = await Payment.findOneBy({id:req.body.id});
        res.status(201).json({payment2});
    }catch(error){
        res.status(400).json({error});
    }
}

export const deletePayment = async (req: Request, res: Response) => {
    try{
        await Payment.delete(parseInt(req.params.id));
        res.status(200).json({id:req.params.id})
    }catch(error){
        res.status(500).json({error});
    }
}