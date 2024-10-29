import { Request, Response } from "express";
import { Extract } from "../entity/Extract";
import path from "path";
import PDFDocument from "pdfkit";

//Retornar os ultimos 5 resultados
//Veirifcar se as despesas e receitas dependem da função searchInitial para serem calculadas
export const all = async (req: Request, res: Response) => {
    await Extract.find({
        skip:0,
        take:5
    }).then((data)=>{
        res.json(data);
    })
}

export const paymentsMadeMonth = async (req: Request, res: Response) => {
    await Extract.query(`select title from extract where 
    date >= "${new Date().getFullYear()}-${req.params.month}-01" and
    date <= "${new Date().getFullYear()}-${req.params.month}-${Number(req.params.month) === 2 ? "29": Number(req.params.month) === 1 || 3 || 5 || 7 || 8 || 10 || 12 ? "31" : "30"}}"`)
    .then((data)=>{
        res.json(data);
    }).catch((error:Error)=>{
        res.json(error);
    })
}

export const createExtract = async (req: Request, res: Response) => {
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
        const extract = await Extract.findOneBy({id:req.body.id});
        await Extract
        .createQueryBuilder()
        .update(extract)
        .set({
            date: req.body.date ?? extract.date,
            category: req.body.category ?? extract.category,
            title: req.body.title ?? extract.title,
            value: req.body.value ?? extract.value,
            proofTransaction: req.file ? req.file.originalname : extract.proofTransaction,
        })
        .where(`id = :id`, {id: req.body.id})
        .execute();

        const extractUpdated = await Extract.findOneBy({id:req.body.id});
        res.status(201).json({extractUpdated});
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

export const ReportSearchPeriodCSV = async (req: Request, res: Response) => {
    try{
         // Realiza a consulta no banco de dados com as datas fornecidas
         const testes: Extract[] = await Extract.query(`SELECT * FROM extract WHERE date >= "${req.params.dateInitial}" AND date <= "${req.params.dateFinal}" ORDER BY date DESC`);

         // Função para gerar o conteúdo CSV
         const generateCSVReport = (data: Extract[]): string => {
             const headers = "Categoria,Titulo,Valor,Data\n";
             const rows = data.map(item => `${item.category},${item.title},${item.value},${item.date.toLocaleDateString('pt-BR')}`).join("\n");
             return headers + rows;
         };
 
         // Gera o CSV a partir dos dados da consulta
         const csvContent = generateCSVReport(testes);
 
         // Define cabeçalhos para o download do arquivo
         res.header('Content-Type', 'text/csv');
         res.header('Content-Disposition', 'attachment; filename="relatorio-extract.csv"');
         
         // Envia o conteúdo CSV como resposta
         res.send(csvContent);
    

}catch(error){
    console.error("Erro ao gerar relatório PDF:", error);
    res.status(500).json({ message: "Erro ao gerar relatório PDF" });
}
}

export const ReportSearchPeriodPDF = async (req: Request, res: Response) => {
    try{
         // Realiza a consulta no banco de dados com as datas fornecidas
         const testes: Extract[] = await Extract.query(`SELECT * FROM extract WHERE date >= "${req.params.dateInitial}" AND date <= "${req.params.dateFinal}" ORDER BY date DESC`);

         // Cria um novo documento PDF
         const doc = new PDFDocument();
        
         // Define cabeçalhos para o navegador reconhecer como download
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename="relatorio-extract.pdf"');
 
         // Define o fluxo de dados do PDF para a resposta HTTP
         doc.pipe(res);
 
         const larguraColuna1 = 150; // Largura da coluna da categoria
         const larguraColuna2 = 150; // Largura da coluna do título
         const larguraColuna3 = 150; // Largura da coluna do valor
         const larguraColuna4 = 150; // Largura da coluna da data

        // Cabeçalhos
        doc.fontSize(12).text("Categoria", { continued: true, width: larguraColuna1 }).text("Título", { continued: true, width: larguraColuna2 }).text("Valor", { continued: true, width: larguraColuna3 }).text("Data", { width: larguraColuna4 });
        doc.moveDown();
 
         testes.forEach((item) => {
            const categoria = item.category.padEnd(larguraColuna1 / 7, ' '); // Ajuste para o tamanho da coluna
            const titulo = item.title.padEnd(larguraColuna2 / 7, ' '); // Ajuste para o tamanho da coluna
            const valor = item.value.toString().padEnd(larguraColuna3 / 7, ' '); // Ajuste para o tamanho da coluna
            const data = item.date.toLocaleDateString('pt-BR').padEnd(larguraColuna4 / 7, ' '); // Ajuste para o tamanho da coluna
            
            doc.text(`${categoria}${titulo}${valor}${data}`);
            doc.moveDown();
        });
 
         // Finaliza a criação do PDF
         doc.end();
    

}catch(error){
    console.error("Erro ao gerar relatório PDF:", error);
    res.status(500).json({ message: "Erro ao gerar relatório PDF" });
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

export const searchPeriodGraphic = async (req: Request, res: Response) => {
    try{
        await Extract.query(`SELECT
        CONCAT(MONTHNAME(STR_TO_DATE(date, '%Y-%m-%d')), ' ', YEAR(STR_TO_DATE(date, '%Y-%m-%d'))) AS mes_ano,
        SUM(CASE WHEN category <> 'Débito' THEN value ELSE 0 END) AS total,
        SUM(CASE WHEN category = 'Débito' THEN value ELSE 0 END) AS total_debito
    FROM
        extract
    WHERE
        date BETWEEN '${req.params.dateInitial}' AND '${req.params.dateFinal}'
    GROUP BY
        mes_ano
    ORDER BY
    MIN(STR_TO_DATE(date, '%Y-%m-%d'))`)
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
        await Extract.query(`select * from extract where month(date) = ${currentDate.getMonth()+1} order by date desc limit 0, 5`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const changePage = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} order by date desc limit ${req.params.page}, 5`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchNextMonth = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} order by date desc limit 0, 5`)
        .then((data)=>{
            res.json(data);
        })

    }catch(error){
        res.status(500).json({error});
    }
}

export const searchPreviousMonth = async (req: Request, res: Response) => {
    try{
        await Extract.query(`select * from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} order by date desc limit 0, 5`)
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

export const expensesPartial = async (req: Request, res: Response) => {
    try{
        const extractTotalResult = await Extract.query(`select sum(value) as total from extract where month(date) = ${parseInt(req.params.month)} and year(date) = ${new Date().getFullYear()} and category = "Débito"`);
        const extractTotal = extractTotalResult[0]?.total || 0;
        
        const collaboratorsTotalResult = await expenseCollaborators(Number(req.params.month));
        const collaborators = collaboratorsTotalResult[0].total || 0;

            // const finalTotal = collaborators === 0 ? 0 : (extractTotal - collaborators);
            const finalTotal = (extractTotal - collaborators);
            res.json(finalTotal);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const expenseCollaborators = async(mes: number): Promise<number> => {
    try{
        const total: number = await Extract.query(`SELECT SUM(e.value) AS total
        FROM extract e
        JOIN payment p ON e.title = p.name
        WHERE e.category = 'debito' AND MONTH(e.date) = ${mes} and year(date) = ${new Date().getFullYear()} and p.category = 'Porcentagem';`)
        return total;
    }catch(error){
        console.error('Erro ao obter despesas de colaboradores:', error);
        throw error;
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
