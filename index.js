import express from 'express';
import winston from 'winston';
import accountsRouter from './routes/accounts.router.js';
import {promises as fs} from 'fs';
import cors from 'cors';
import basicAuth from 'express-basic-auth'
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import accountServices from './services/account.services.js';

const { printf, combine, label, timestamp } = winston.format;
const {readFile, writeFile} = fs;
const myformat = printf(({ level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
})

global.fileName = 'accounts.json';
const app = express();
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "myBank.log"})
  ],
  format: combine(
    label({label: "myBank"}),
    timestamp(),
    myformat
  )
})

/*const schema = buildSchema(`
  type Account{
    id: Int
    name: String
    balance: Float
  }
  input AccountInput{
    id: Int
    name: String
    balance: Float
  }
  type Query {
    getAccounts: [Account]
    getAccount(id: Int): Account
  }
  type Mutation {
    createAccount(account: AccountInput): Account
    deleteAccount(id: Int): Boolean
    updateAccount(account: AccountInput): Account
  }
`);

const root = {
  getAccounts: () => accountServices.getAccounts(),
  getAccount(args) {
    return accountServices.getAccountsById(args.id)
  },
  createAccount({account}){
    return accountServices.createAccount(account)
  },
  deleteAccount(args){
    accountServices.deleteAccount(args.id)
  },
  async updateAccount({account}){
    return accountServices.updateAccount(account)
  }
}

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))*/

app.use(express.json());
app.use(express.static("public"))
app.use(cors())
//app.use(basicAuth({
//  users: {'admin': 'admin'}
//}))

function getRole(username){
  if(username == 'admin'){
    return 'admin'
  }else if(username == 'ricardo'){
    return 'role'
  }
}

function authorize(...allowed){
  const isAllowed = role => allowed.indexOf(role)>-1;

  return (req, res, next) => {
    if(req.auth.user){
      const role = getRole(req.auth.user)
      if(isAllowed(role)){
        next()
      }else{
        res.status(401).send('Role not allowed')
      }
    }else{
      res.status(403).send('User not found')
    }
  }
}

app.use(basicAuth({
  authorizer: (username, password) => {
    const userMatch = basicAuth.safeCompare(username, 'admin')
    const pwdMatch = basicAuth.safeCompare(password, 'admin')
    const user2Match = basicAuth.safeCompare(username, 'ricardo')
    const pwd2Match = basicAuth.safeCompare(password, '1234')

    return userMatch && pwdMatch || pwd2Match && user2Match
  }
}))

app.use('/account', authorize('admin', 'role'), accountsRouter);



app.listen(8080, async () => {
  try{
    await readFile(fileName);
    logger.info('API online');
    
  }catch(err){
    const initialJson = {
      nextId: 1,
      accounts: []
    }
    writeFile(fileName, JSON.stringify(initialJson)).then(() => {
      logger.info('API online, file created');
    }).catch(err => {
      logger.error(err);
    })
  }
})