import * as extractController from "../../controller/ExtractController";
import express from "express";

const router = express.Router();

router.get('/extract', extractController.all);
router.get('/extract/search', extractController.searchPeriod);
router.get('/extract/search/initial', extractController.searchInitial);
router.get('/extract/search/next/:month/:year', extractController.searchNextMonth);
router.get('/extract/search/previous/:month/:year', extractController.searchPreviousMonth);
router.get('/extract/search/expenses/:month', extractController.expenses);
router.get('/extract/search/receipt/:month', extractController.receipt);
router.post('/extract', extractController.createExtract);
router.delete('/extract/delete/:id', extractController.deleteExtract);

export default router;