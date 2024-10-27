import * as userController from "../../controller/UserController";
import express from "express";

const router = express.Router();

router.get('/teste', userController.all);
// router.post('/createTeste', userController.create);
router.post('/login', userController.login);

export default router;