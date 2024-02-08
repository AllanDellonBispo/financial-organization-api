import { Request, Response } from "express";
import { Extract } from "../entity/Extract";
import path from "path";


export const all = async (req: Request, res: Response) => {
    await Extract.find().then((data)=>{
        res.json(data);
    })
}

export const createExtract = async (req: Request, res: Response) => {
    // console.log("Foii")
    // console.log(req.file)
    // console.log(req.body)
    try{
        const extract = new Extract();
        extract.date = req.body.date;
        extract.category = req.body.category;
        extract.title = req.body.title;
        extract.value = req.body.value;
        extract.proofTransaction = req.file.originalname;
        await Extract.save(extract);
        res.status(201).json({extract});
    }catch(error){
        res.status(400).json({error});
    }
}

export const updateExtract = async (req: Request, res: Response) => {
    try{
        await Extract
        .createQueryBuilder()
        .update(req.body)
        .set({
            date: req.body.dateUpdate,
            category: req.body.categoryUpdate,
            title: req.body.titleUpdate,
            value: req.body.valueUpdate,
            proofTransaction: req.file.originalname,
        })
        .where(`id = :id`, {id: parseInt(req.body.id)})
        .execute();

        const extract = await Extract.findBy({id:req.body.id});
        res.status(201).json({extract});
    }catch(error){
        res.status(400).json({error});
    }
}

export const searchPeriod = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where
                             date >= "${req.params.dateInitial}" and
                             date <= "${req.params.dateFinal}" order by date desc`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchPeriodReceipt = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where
                             date >= "${req.params.dateInitial}" and
                             date <= "${req.params.dateFinal}" and
                             category = "Crédito" order by date desc`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchPeriodExpenses = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where
                             date >= "${req.params.dateInitial}" and
                             date <= "${req.params.dateFinal}" and
                             category = "Débito" order by date desc`)
        .then((data)=>{
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
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.params.month)+1} and year(date) = ${new Date().getFullYear()}`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchPreviousMonth = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.params.month)-1} and year(date) = ${new Date().getFullYear()}`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const expenses = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select sum(value) as total from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} and category = "Débito"`)
        .then((data)=>{
            if(data[0].total === null){
                data[0].total = 0;
            }
            res.json(data[0].total);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const receipt = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select sum(value) as total from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} and category = "Crédito"`)
        .then((data)=>{
            if(data[0].total === null){
                data[0].total = 0;
            }
            res.json(data[0].total);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const deleteExtract = async (req: Request, res: Response) => {
    try{
        await Extract.delete(parseInt(req.params.id));
        res.status(200).json({id:req.params.id})
    }catch(error){
        res.status(500).json({error});
    }
}

export const fileDownload = async (req: Request, res: Response) => {
        const extract = await Extract.findOneBy({
            id: parseInt(req.params.id)
        });
        const filePath = path.join(__dirname, '../../tmp').replace(/[\\"]/g,'/');
        res.download(filePath+`/${extract.proofTransaction}`,`/${extract.proofTransaction}`, (err) => {
            if (err) {
                console.log(err)
                // Handle error, but keep in mind the response may be partially-sent
                // so check res.headersSent
            } else {
              // decrement a download credit, etc.
            }
          }
           );
        
    }
