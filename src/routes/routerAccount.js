import express from 'express';
import controller from '../controllers/accountController.js';

const app = express.Router();

app.get('/', controller.getAll);

app.get('/balance/:agencia/:conta', controller.getBalance);

app.get('/balance/:agencia', controller.getAgenciaBalance);

app.get('/menorsaldo/:qtd', controller.getMenorSaldo);

app.get('/maiorsaldo/:qtd', controller.getMaiorSaldo);

app.post('/', controller.insert);

app.patch('/', controller.update);

app.patch('/transfer', controller.transfer);

app.patch('/private99', controller.privade99);

app.delete('/:id', controller.remove);

app.delete('/balance/:agencia/:conta', controller.removeCount);

export { app as accountRouter };

//falta implementar topico 10 em diante do pdf.
