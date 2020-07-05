import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//implementação dotenv, para não enviar,
// variaveis glabais para repositorio como USER e SENHA.
//antes de executar o programa, necessario definir PRD caso não tenha definido senha
//PRD=true USERDB='seu_nick_DB' PWDDB='sua_senha_DB' node app
//ou você pode criar um arquivo .env clonado de sample-env
//e acrescente suas credenciais.
// e executar assim: PRD=false node app
//if (process.env.PRD !== true) dotenv.config();
import { accountRouter } from './src/routes/routerAccount.js';

//Incialização BD...
(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@igti.dgf5j.gcp.mongodb.net/my-bank-api?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log('BD Conected...');
  } catch (err) {
    console.log(err);
  }
})();

//Incialização API...
const app = express();
app.use(express.json());
app.use(accountRouter);
app.listen(process.env.PORT, () => {
  console.log('API Started...');
});
