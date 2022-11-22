import { promises as fs} from 'fs';
const {readFile, writeFile} = fs;

async function getAccounts(){
  const data = JSON.parse(await readFile(global.fileName));
  return data.accounts
}

async function getAccount(id){
  const data = JSON.parse(await readFile(global.fileName));
  const account = data.accounts.find(account => account.id === id);
  if(!account){
    throw new Error("Registro não encontrado")
  }
  return account
}

async function insertNewAccount(account){
  const data = JSON.parse(await readFile(global.fileName));
  account = {
    id: data.nextId++,
    name: account.name,
    balance: account.balance
  };
data.accounts.push(account);

await writeFile(global.fileName, JSON.stringify(data, null, 2));
return account
}

async function deleteAccount(id){
  const data = JSON.parse(await readFile(global.fileName));
  data.accounts = data.accounts.filter(account => account.id !== id);
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
}

async function updateAccount(account){
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex(acc => acc.id === account.id);
    
  if (index === -1){
    throw new Error("Registro não encontrado");
  }
    
  data.accounts[index].name = account.name;
  data.accounts[index].balance = account.balance;
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  return data.accounts[index]
}

async function updateBalance(account){
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex(a => a.id === account.id);
  if(index === -1){
    throw new Error("Registro não encontrado.")
  }
  data.accounts[index].balance = account.balance

  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  return data.accounts[index]
}

export default{
  getAccounts,
  insertNewAccount,
  deleteAccount,
  updateAccount,
  updateBalance,
  getAccount
}