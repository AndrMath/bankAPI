import express from 'express';
import accountController from '../controller/account.controller.js';

const router = express.Router();

router.get(`/`, accountController.getAccounts)
router.get('/:id', accountController.getAccountsById)
router.post('/', accountController.createAccount)
router.delete('/:id', accountController.accountDelete)
router.put('/', accountController.accountEdit)
router.patch('/updateBalance', accountController.balanceUpdate)

router.use((err, req, res, next) => {
  global.logger.error(`Tried ${req.method} - in ${req.baseUrl} - but ${err.message}`);
  res.status(400).send({error: err.message});
})

export default router;