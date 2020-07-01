import express from 'express';
import mongoose from 'mongoose';

import { accountRouter } from './src/routes/routerAccount.js';

//Incialização BD...
// const uri =
//   'mongodb+srv://black:pa123123@igti.dgf5j.gcp.mongodb.net/my-bank-api?retryWrites=true&w=majority';
(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://black:pa123123@igti.dgf5j.gcp.mongodb.net/my-bank-api?retryWrites=true&w=majority',
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
const port = 3000;
app.use(express.json());
app.use(accountRouter);
app.listen(port, () => {
  console.log('API Started...');
});
