import { Request, Response } from "express";
import { Payment } from "../entity/Payment";
import { Extract } from "../entity/Extract";


export const all = async (req: Request, res: Response) => {
    await Payment.find({
        order:{
            category: 'ASC',
            value:'DESC'
        }
    }).then((data)=>{
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
        payment.status = 'N';

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

        const paymentUpdated = await Payment.findOneBy({id:req.body.id});
        res.status(201).json({paymentUpdated});
    }catch(error){
        res.status(400).json({error});
    }
}

//Mudar nome de função para realiza pagamento 
export const updateStatus = async (req: Request, res: Response) => {

    //A função não precisa modificar o status para S ou N desde que o backend faça uma verificação se houve um extract para aquele id naquele mês
    try{
        const payment = await Payment.findOneBy({id:parseInt(req.params.id)});

        const financialStatement = await Extract.query(`select sum(value) - (select sum(value) as total from extract where month(date) = ${new Date().getMonth()+1} and year(date) = ${new Date().getFullYear()} and category = "Débito") as total from extract where month(date) = ${new Date().getMonth()+1} and year(date) = ${new Date().getFullYear()} and category = "Crédito"`)
            .then((data)=>{
                if(data[0].total === null){
                    return data[0].total = 0;
                }
                return data[0].total;
            });
            console.log(financialStatement)
        const total = payment.category === 'Fixo' ? payment.value : (payment.value/100)* Number(financialStatement);
        const extract = new Extract();
        extract.date = new Date(new Date().toISOString().substring(0,10));
        extract.category = 'Débito';
        extract.title = payment.name;
        extract.value = total;
        extract.proofTransaction = '';
        await Extract.save(extract);
      
        // await Payment.save(payment);

        // Atenção, precisa realizar a atualização em massa selecionando primeiro os fixos e depois as porcentagens

        const paymentUpdated = await Payment.findOneBy({id:parseInt(req.params.id)});
        res.status(201).json({paymentUpdated, value: total});
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