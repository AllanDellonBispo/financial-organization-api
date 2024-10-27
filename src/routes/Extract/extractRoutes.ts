import multer from "multer";
import * as extractController from "../../controller/ExtractController";
import * as paymentController from "../../controller/PaymentController";
import * as userController from "../../controller/UserController";
import express from "express";
import { Auth } from "../../middlewares/auth";

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storageConfig
});

const router = express.Router();

router.get('/extract', Auth.private ,extractController.all);
router.get('/extract/payments/month/:month', extractController.paymentsMadeMonth);
router.get('/extract/filter/:dateInitial/:dateFinal', extractController.searchPeriod);
router.get('/extract/filter/graphic/:dateInitial/:dateFinal', extractController.searchPeriodGraphic);
router.get('/extract/filter/receipt/:dateInitial/:dateFinal', extractController.searchPeriodReceipt);
router.get('/extract/filter/expenses/:dateInitial/:dateFinal', extractController.searchPeriodExpenses);
router.get('/extract/search/initial', extractController.searchInitial);
router.get('/extract/search/page/:month/:page', extractController.changePage);
router.get('/extract/search/next/:month/:year', extractController.searchNextMonth);
router.get('/extract/search/previous/:month/:year', extractController.searchPreviousMonth);
router.get('/extract/search/expenses/partial/:month', extractController.expensesPartial);
router.get('/extract/search/expenses/:month', extractController.expenses);
router.get('/extract/search/receipt/:month', extractController.receipt);
router.get('/extract/fileDownload/:id', extractController.fileDownload);
// router.post('/extract', extractController.createExtract)\;
router.delete('/extract/delete/:id', extractController.deleteExtract);

router.post('/extract', upload.single('proofTransaction'), extractController.createExtract);
router.put('/extract', upload.single('proofTransactionUpdate'), extractController.updateExtract);


router.get('/payment', paymentController.all);
router.post('/payment', paymentController.create);
router.put('/payment', paymentController.update);
router.put('/payment/:id', paymentController.updateStatus);
router.delete('/payment/:id', paymentController.deletePayment);

router.post('/login', userController.login);


export default router;