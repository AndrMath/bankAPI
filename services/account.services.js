import repository from '../repository/account.repository.js'

async function createAccount(account){
  return await repository.insertNewAccount(account)
}

async function getAccounts(){
  return await repository.getAccounts()
}

async function getAccountsById(id){
  return await repository.getAccount(id)
}

async function deleteAccount(Id){
  await repository.deleteAccount(Id)
}

async function updateAccount(account){
  return await repository.updateAccount(account)
}

async function updateBalance(account){
  return await repository.updateBalance(account)
}

export default {
  createAccount,
  getAccounts,
  getAccountsById,
  deleteAccount,
  updateAccount,
  updateBalance
}