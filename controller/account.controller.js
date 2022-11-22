import services from '../services/account.services.js'

async function createAccount(req, res, next) {
    try{
        let account = req.body;
        if(!account.name || account.balance == null){
          throw new Error("Informe um name(nome) e balance(saldo)");
        }
        account = await services.createAccount(account)
        global.logger.info(`Post /account new account: ${JSON.stringify(account)}`);
        res.send(account);
    }catch(err){
        next(err);
    }
}

async function getAccounts(req, res, next){
    try{
        const data = await services.getAccounts()
        global.logger.info(`Get /account`)
        res.send(data);
    }catch (err){
        next(err);
    }
}

async function getAccountsById(req, res, next){
    try{
        const account = await services.getAccountsById(parseInt(req.params.id))
        global.logger.info(`Get /account/${req.params.id} account: ${JSON.stringify(account)}`)
        res.send(account);
    }catch (err){
      next(err);
    }
}

async function accountDelete(req, res, next){
    try{
        await services.deleteAccount(parseInt(req.params.id))
        global.logger.info(`Deleted /account/${req.params.id}`)
        res.send('Removido com sucesso');
    }catch(err){
        next(err);
    }
}

async function accountEdit(req, res, next){
    try{
        const account = req.body;
        if(!account.id || !account.name || account.balance == null){
          throw new Error("Informe um Id e name(nome) e balance(saldo)");
        }
        await services.updateAccount(account)
        global.logger.info(`Put /account: ${JSON.stringify(account)}`)
        res.send(account);
    }catch(err){
        next(err);
    }
}

async function balanceUpdate(req, res, next){
    try{
        const account = req.body;
        if(!account.id || !account.balance == null){
          throw new Error("Informe um Id e balance(saldo)");
        }
        const changed = await services.updateBalance(account)
        global.logger.info(`Patch /account/updateBalance new balance: ${JSON.stringify(account)}`)
        res.send(changed);
    }catch(err){
        next(err);
    }
}

export default {
    createAccount,
    getAccounts,
    getAccountsById,
    accountDelete,
    accountEdit,
    balanceUpdate,
}